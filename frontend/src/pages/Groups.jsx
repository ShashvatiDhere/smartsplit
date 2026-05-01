import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getGroups, createGroup } from '../api/endpoints';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Users, Plus, Loader2 } from 'lucide-react';

export const Groups = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newGroupName, setNewGroupName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchGroups();
    }
  }, [user]);

  const fetchGroups = async () => {
    try {
      const response = await getGroups(user.id);
      setGroups(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching groups:', error);
      setGroups([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!newGroupName.trim() || !user?.id) return;

    setIsCreating(true);
    try {
      const response = await createGroup(user.id, { name: newGroupName });
      setGroups(prev => [...prev, response.data]);
      setNewGroupName('');
    } catch (error) {
      console.error('Error creating group:', error);
      alert('Failed to create group. Please check backend.');
    } finally {
      setIsCreating(false);
    }
  };

  const formatINR = (val) => {
    return Number(val || 0).toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground font-medium animate-pulse">Loading your groups...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black tracking-tight text-slate-900">Your Groups</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Create Group Card */}
        <Card className="border-2 border-dashed bg-slate-50/50 flex flex-col justify-center items-center text-center p-2">
          <form onSubmit={handleCreateGroup} className="w-full p-6 space-y-4">
            <div className="bg-primary/10 w-12 h-12 mx-auto rounded-2xl flex items-center justify-center mb-2">
              <Plus className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold text-lg">Create New Group</h3>
            <Input
              placeholder="e.g. Goa Trip, Roommates"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              disabled={isCreating}
              className="bg-white"
            />
            <Button type="submit" className="w-full rounded-xl" disabled={isCreating || !newGroupName.trim()}>
              {isCreating ? 'Creating...' : 'Create Group'}
            </Button>
          </form>
        </Card>

        {/* Existing Groups */}
        {groups.map((group) => (
          <Card key={group.id} className="hover:shadow-xl transition-all border-slate-200 group overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 bg-slate-50/50 border-b">
              <CardTitle className="truncate font-bold text-slate-800">{group.name}</CardTitle>
              <div className="bg-white p-2 rounded-lg shadow-sm">
                <Users className="w-4 h-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Your Balance</p>
                  <p className={`text-xl font-black ${Number(group.myBalance) < 0 ? 'text-rose-600' : Number(group.myBalance) > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {formatINR(group.myBalance)}
                    <span className="text-[10px] ml-1 uppercase opacity-70">
                      {Number(group.myBalance) < 0 ? 'Owe' : Number(group.myBalance) > 0 ? 'Get' : ''}
                    </span>
                  </p>
                </div>
                <Button asChild size="sm" className="rounded-xl px-6 shadow-md shadow-primary/10 transition-transform active:scale-95">
                  <Link to={`/groups/${group.id}`}>View Details</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {groups.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="bg-slate-100 p-6 rounded-full mb-4">
            <Users className="w-12 h-12 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No groups yet</h3>
          <p className="text-slate-500 max-w-xs mt-2 font-medium">Create your first group above to start splitting expenses with friends.</p>
        </div>
      )}
    </div>
  );
};

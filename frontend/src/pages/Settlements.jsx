import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { getSettlements, markSettlementPaid, getGroups } from '../api/endpoints';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export const Settlements = () => {
  const { user } = useAuth();
  const [settlements, setSettlements] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchInitialData();
    }
  }, [user]);

  const fetchInitialData = async () => {
    try {
      const groupsRes = await getGroups(user.id);
      setGroups(groupsRes.data || []);
      // Fetch for all or first group depending on preference
      fetchSettlements(''); 
    } catch (error) {
      console.error('Error fetching initial data:', error);
      setLoading(false);
    }
  };

  const fetchSettlements = async (groupId) => {
    setLoading(true);
    try {
      const response = await getSettlements(groupId);
      setSettlements(response.data || []);
    } catch (error) {
      console.error('Error fetching settlements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGroupChange = (e) => {
    const groupId = e.target.value;
    setSelectedGroupId(groupId);
    fetchSettlements(groupId);
  };

  const handleMarkPaid = async (id) => {
    try {
      await markSettlementPaid(id);
      // Remove from list or update status locally
      setSettlements(settlements.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error marking as paid:', error);
      alert('Failed to mark as paid');
    }
  };

  if (loading && groups.length === 0) return <div className="animate-pulse">Loading settlements...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Settlements</h1>
          {groups.length > 0 && (
            <select
              value={selectedGroupId}
              onChange={handleGroupChange}
              className="flex h-10 rounded-xl border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">All Groups</option>
              {groups.map(g => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Suggested Settlements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : settlements.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                You are all settled up!
              </div>
            ) : (
              settlements.map((settlement) => (
                <div key={settlement.id || Math.random()} className="flex items-center justify-between p-4 rounded-xl border bg-card">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">{settlement.payerName || settlement.payer || 'User ' + settlement.payerId}</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      <span className="font-semibold">{settlement.payeeName || settlement.payee || 'User ' + settlement.payeeId}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="font-bold text-xl">
                      ${(settlement.amount || 0).toFixed(2)}
                    </div>
                    {/* Assuming payer is the one who should mark it paid, or anyone can */}
                    <Button onClick={() => handleMarkPaid(settlement.id)} variant="outline" size="sm" className="gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      Mark Paid
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

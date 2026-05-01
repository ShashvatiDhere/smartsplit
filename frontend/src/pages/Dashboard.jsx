import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { getBalances, getGroups } from '../api/endpoints';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, TrendingDown, DollarSign, Wallet, Users, Receipt, Plus, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const Dashboard = () => {
  const { user } = useAuth();
  const [balances, setBalances] = useState({ totalOwed: 0, totalToGet: 0, netBalance: 0 });
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const [balanceRes, groupsRes] = await Promise.all([
        getBalances(user.id),
        getGroups(user.id)
      ]);
      
      const balanceData = balanceRes.data || {};
      setBalances({
        totalOwed: Number(balanceData.totalOwed) || 0,
        totalToGet: Number(balanceData.totalToGet) || 0,
        netBalance: Number(balanceData.netBalance) || 0
      });
      setGroups(Array.isArray(groupsRes.data) ? groupsRes.data : []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Fallback to zeros if API fails, but don't crash
      setBalances({ totalOwed: 0, totalToGet: 0, netBalance: 0 });
    } finally {
      setLoading(false);
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
        <p className="text-muted-foreground font-medium animate-pulse">Fetching your summary...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-slate-500 font-medium mt-1">Welcome back, {user?.name || 'User'}! Here's your summary.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/groups">
            <Button variant="outline" className="rounded-xl border-slate-200">
              <Users className="w-4 h-4 mr-2" />
              View Groups
            </Button>
          </Link>
          <Link to="/expenses">
            <Button className="rounded-xl shadow-lg shadow-primary/20">
              <Plus className="w-4 h-4 mr-2" />
              New Expense
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-xl shadow-slate-200/60 bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Wallet className="w-24 h-24" />
          </div>
          <CardContent className="p-8">
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Net Balance</p>
            <h2 className="text-5xl font-black mt-2 tracking-tighter">
              {formatINR(balances.netBalance)}
            </h2>
            <div className="mt-6 flex items-center gap-2">
              <div className={`px-2 py-1 rounded-lg text-xs font-black uppercase ${balances.netBalance >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                {balances.netBalance >= 0 ? 'Overall Surplus' : 'Overall Deficit'}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl shadow-emerald-100/40 bg-emerald-50 relative overflow-hidden group">
          <div className="absolute -bottom-4 -right-4 p-8 text-emerald-100 transition-transform group-hover:scale-110">
            <TrendingUp className="w-24 h-24" />
          </div>
          <CardContent className="p-8">
            <div className="bg-emerald-100 w-12 h-12 rounded-2xl flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">You are owed</p>
            <h2 className="text-4xl font-black mt-1 tracking-tighter text-emerald-700">
              {formatINR(balances.totalToGet)}
            </h2>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl shadow-rose-100/40 bg-rose-50 relative overflow-hidden group">
          <div className="absolute -bottom-4 -right-4 p-8 text-rose-100 transition-transform group-hover:scale-110">
            <TrendingDown className="w-24 h-24" />
          </div>
          <CardContent className="p-8">
            <div className="bg-rose-100 w-12 h-12 rounded-2xl flex items-center justify-center mb-4">
              <TrendingDown className="w-6 h-6 text-rose-600" />
            </div>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">You owe</p>
            <h2 className="text-4xl font-black mt-1 tracking-tighter text-rose-700">
              {formatINR(balances.totalOwed)}
            </h2>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Groups */}
        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold">Your Groups</CardTitle>
            <Link to="/groups" className="text-xs font-bold text-primary hover:underline">See all</Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {groups.length > 0 ? (
                groups.slice(0, 3).map((group) => (
                  <Link 
                    key={group.id} 
                    to={`/groups/${group.id}`}
                    className="flex items-center justify-between p-5 hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary transition-transform group-hover:scale-110">
                        <Users className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 group-hover:text-primary transition-colors">{group.name}</p>
                        <p className="text-xs text-slate-400 font-medium">Click to view details</p>
                      </div>
                    </div>
                    <div className="bg-slate-100 p-2 rounded-xl text-slate-400 group-hover:text-primary group-hover:bg-primary/10 transition-all">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </Link>
                ))
              ) : (
                <div className="p-10 text-center text-slate-400 font-medium">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>You're not in any groups yet.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions / Tips */}
        <div className="space-y-6">
          <Card className="border-none bg-gradient-to-r from-primary to-indigo-600 text-white shadow-xl shadow-primary/20 p-8 flex items-center gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <DollarSign className="w-20 h-20" />
            </div>
            <div className="relative z-10 flex-1">
              <h3 className="text-xl font-black">Settle Up Now</h3>
              <p className="text-primary-foreground/80 text-sm font-medium mt-1">Review your suggested settlements and clear your dues instantly.</p>
              <Link to="/settlements">
                <Button className="mt-4 bg-white text-primary hover:bg-white/90 rounded-xl font-bold shadow-lg">
                  Go to Settlements
                </Button>
              </Link>
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Link to="/notifications" className="block">
              <Card className="border-slate-200 shadow-sm p-6 flex flex-col items-center text-center group cursor-pointer hover:border-primary transition-colors h-full">
                <div className="bg-orange-100 p-3 rounded-2xl text-orange-600 mb-3 group-hover:scale-110 transition-transform">
                  <Receipt className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-900">Activity</p>
              </Card>
            </Link>
            <Link to="/expenses" className="block">
              <Card className="border-slate-200 shadow-sm p-6 flex flex-col items-center text-center group cursor-pointer hover:border-primary transition-colors h-full">
                <div className="bg-blue-100 p-3 rounded-2xl text-blue-600 mb-3 group-hover:scale-110 transition-transform">
                  <Receipt className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-900">History</p>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getGroupDetails, getExpenses, getBalances } from '../api/endpoints';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  Receipt, 
  Users, 
  Wallet, 
  Scale, 
  ArrowLeft, 
  Plus, 
  ArrowRight,
  TrendingUp,
  CreditCard,
  Utensils,
  Car,
  Camera,
  ShoppingBag,
  Home
} from 'lucide-react';

const CategoryIcon = ({ category, className }) => {
  const c = category?.toLowerCase() || '';
  if (c.includes('food')) return <Utensils className={className} />;
  if (c.includes('travel') || c.includes('taxi')) return <Car className={className} />;
  if (c.includes('hotel') || c.includes('stay')) return <Home className={className} />;
  if (c.includes('sightseeing') || c.includes('camera')) return <Camera className={className} />;
  if (c.includes('shopping')) return <ShoppingBag className={className} />;
  return <Receipt className={className} />;
};

const CategoryColor = (category) => {
  const c = category?.toLowerCase() || '';
  if (c.includes('food')) return 'bg-green-100 text-green-600';
  if (c.includes('travel') || c.includes('taxi')) return 'bg-purple-100 text-purple-600';
  if (c.includes('hotel') || c.includes('stay')) return 'bg-orange-100 text-orange-600';
  if (c.includes('sightseeing') || c.includes('camera')) return 'bg-blue-100 text-blue-600';
  if (c.includes('shopping')) return 'bg-pink-100 text-pink-600';
  return 'bg-gray-100 text-gray-600';
};

export const GroupDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState([]);
  const [summary, setSummary] = useState({
    totalExpense: 0,
    peopleCount: 0,
    perPersonShare: 0,
    youSettled: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && user?.id) {
      fetchData();
    }
  }, [id, user]);

  const fetchData = async () => {
    try {
      const [groupRes, expensesRes, balanceRes] = await Promise.all([
        getGroupDetails(id),
        getExpenses(id),
        getBalances(user.id, id)
      ]);
      
      const groupData = groupRes.data;
      const expensesData = expensesRes.data || [];
      const balanceData = balanceRes.data || [];
      
      setGroup(groupData);
      setExpenses(expensesData);
      // Mocking balances if API returns empty for UI demo
      setBalances(balanceData.length > 0 ? balanceData : [
        { userName: 'Rohit', amount: 737.50, type: 'OWE_YOU' },
        { userName: 'Amit', amount: 262.50, type: 'OWE_YOU' },
        { userName: 'Neha', amount: 112.50, type: 'OWE_YOU' }
      ]);

      const total = expensesData.reduce((sum, exp) => sum + exp.amount, 0);
      const people = groupData.members?.length || 1;
      
      setSummary({
        totalExpense: total,
        peopleCount: people,
        perPersonShare: total / people,
        youSettled: expensesData.filter(e => e.paidByUserId === user.id).reduce((sum, e) => sum + e.amount, 0)
      });

    } catch (error) {
      console.error('Error fetching group details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!group) return <div>Group not found</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link to="/groups" className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-2">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Groups
          </Link>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">{group.name}</h1>
          <p className="text-slate-500 font-medium mt-1">Trip Details | {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <div className="bg-primary/10 p-3 rounded-2xl">
          <Users className="w-6 h-6 text-primary" />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-blue-100 bg-blue-50/30">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="bg-blue-100 p-3 rounded-2xl mb-3">
              <Receipt className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-sm font-medium text-slate-500">Total Expense</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">₹{summary.totalExpense.toLocaleString('en-IN')}</p>
          </CardContent>
        </Card>

        <Card className="border-green-100 bg-green-50/30">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="bg-green-100 p-3 rounded-2xl mb-3">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-sm font-medium text-slate-500">People</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{summary.peopleCount}</p>
          </CardContent>
        </Card>

        <Card className="border-purple-100 bg-purple-50/30">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="bg-purple-100 p-3 rounded-2xl mb-3">
              <Wallet className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-sm font-medium text-slate-500">Per Person Share</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">₹{summary.perPersonShare.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
          </CardContent>
        </Card>

        <Card className="border-orange-100 bg-orange-50/30">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="bg-orange-100 p-3 rounded-2xl mb-3">
              <Scale className="w-6 h-6 text-orange-600" />
            </div>
            <p className="text-sm font-medium text-slate-500">You Settled</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">₹{summary.youSettled.toLocaleString('en-IN')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Expense Breakdown */}
      <Card className="border-slate-200 overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold">Expense Breakdown</CardTitle>
            <Link to="/expenses">
              <Button size="sm" className="rounded-xl">
                <Plus className="w-4 h-4 mr-2" />
                Add Expense
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-500 text-sm border-b bg-slate-50/30">
                  <th className="px-6 py-4 font-semibold">#</th>
                  <th className="px-6 py-4 font-semibold">Description</th>
                  <th className="px-6 py-4 font-semibold text-right">Total (₹)</th>
                  <th className="px-6 py-4 font-semibold text-center">Paid by</th>
                  <th className="px-6 py-4 font-semibold text-center">Split among</th>
                  <th className="px-6 py-4 font-semibold text-right">Per Person (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {expenses.map((expense, index) => (
                  <tr key={expense.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-400">{index + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${CategoryColor(expense.category)}`}>
                          <CategoryIcon category={expense.category} className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-slate-700">{expense.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-slate-900">{expense.amount.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${expense.paidByUserId === user.id ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                        {expense.paidByUserId === user.id ? 'You' : 'Member'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-slate-600">{Object.keys(expense.splits || {}).length || summary.peopleCount}</td>
                    <td className="px-6 py-4 text-right font-medium text-slate-500">{(expense.amount / (Object.keys(expense.splits || {}).length || summary.peopleCount)).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50/50 font-bold border-t-2">
                  <td colSpan={2} className="px-6 py-4 text-slate-900">Total</td>
                  <td className="px-6 py-4 text-right text-slate-900">{summary.totalExpense.toLocaleString('en-IN')}</td>
                  <td colSpan={2}></td>
                  <td className="px-6 py-4 text-right text-slate-900">{summary.perPersonShare.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Who Owes Whom */}
      <Card className="border-slate-200">
        <CardHeader className="bg-slate-50/50 border-b">
          <CardTitle className="text-xl font-bold">Who Owes Whom</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-1">
            {balances.map((balance, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                    {balance.userName.charAt(0)}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-slate-700">{balance.userName} owes you</span>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                  <span className="font-bold text-green-600 text-lg">₹{balance.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            ))}
            
            <div className="mt-4 p-4 rounded-xl bg-green-50 border border-green-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Wallet className="w-5 h-5 text-green-600" />
                </div>
                <span className="font-bold text-green-800 text-lg">Total you will receive</span>
              </div>
              <span className="font-black text-green-700 text-2xl">₹{balances.reduce((sum, b) => sum + b.amount, 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="text-center text-slate-400 text-sm font-medium pb-8">All amounts are in INR</p>
    </div>
  );
};

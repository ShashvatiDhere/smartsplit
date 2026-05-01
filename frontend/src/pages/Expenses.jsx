import React, { useState, useEffect } from 'react';
import { getGroups, getExpenses } from '../api/endpoints';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Receipt, Plus } from 'lucide-react';
import { AddExpense } from './AddExpense';

export const Expenses = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddExpense, setShowAddExpense] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchInitialData();
    }
  }, [user]);

  const fetchInitialData = async () => {
    try {
      const groupsRes = await getGroups(user.id);
      setGroups(groupsRes.data || []);
      if (groupsRes.data?.length > 0) {
        const firstGroupId = groupsRes.data[0].id;
        setSelectedGroupId(firstGroupId);
        fetchGroupExpenses(firstGroupId);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching initial data:', error);
      setLoading(false);
    }
  };

  const fetchGroupExpenses = async (groupId) => {
    setLoading(true);
    try {
      const response = await getExpenses(groupId);
      setExpenses(response.data || []);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGroupChange = (e) => {
    const groupId = e.target.value;
    setSelectedGroupId(groupId);
    fetchGroupExpenses(groupId);
  };

  const handleExpenseAdded = (newExpense) => {
    if (newExpense.groupId === selectedGroupId || newExpense.groupId == selectedGroupId) {
      setExpenses([newExpense, ...expenses]);
    }
    setShowAddExpense(false);
  };

  if (loading && groups.length === 0) {
    return <div className="animate-pulse">Loading expenses...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
          {groups.length > 0 && (
            <select
              value={selectedGroupId}
              onChange={handleGroupChange}
              className="flex h-10 rounded-xl border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {groups.map(g => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          )}
        </div>
        <Button onClick={() => setShowAddExpense(true)} disabled={groups.length === 0}>
          <Plus className="w-4 h-4 mr-2" />
          Add Expense
        </Button>
      </div>

      {showAddExpense && (
        <Card className="mb-6 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle>Add New Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <AddExpense onAdd={handleExpenseAdded} onCancel={() => setShowAddExpense(false)} preselectedGroupId={selectedGroupId} groups={groups} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Group Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading group expenses...</div>
          ) : (
            <div className="space-y-4">
              {expenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full text-primary">
                      <Receipt className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-base">{expense.title || expense.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {expense.category && <span className="mr-2 px-2 py-0.5 bg-secondary rounded-md">{expense.category}</span>}
                        Paid by user {expense.paidByUserId} on {expense.expenseDate || expense.date}
                      </p>
                    </div>
                  </div>
                  <div className="font-bold text-xl">
                    ${(expense.amount || 0).toFixed(2)}
                  </div>
                </div>
              ))}
              {expenses.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No expenses found for this group.
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

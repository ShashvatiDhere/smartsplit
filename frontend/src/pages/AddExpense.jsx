import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { addExpense, getGroupDetails } from '../api/endpoints';
import { useAuth } from '../context/AuthContext';

export const AddExpense = ({ onAdd, onCancel, preselectedGroupId = '', groups = [] }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [groupId, setGroupId] = useState(preselectedGroupId);
  const [members, setMembers] = useState([]);
  const [splits, setSplits] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (groupId) {
      // Fetch members for the selected group to distribute splits
      getGroupDetails(groupId)
        .then(res => {
          const fetchedMembers = res.data?.members || [];
          setMembers(fetchedMembers);
          // Initialize equal splits
          const newSplits = {};
          fetchedMembers.forEach(m => newSplits[m.id] = '');
          setSplits(newSplits);
        })
        .catch(err => console.error('Failed to fetch group details', err));
    } else {
      setMembers([]);
      setSplits({});
    }
  }, [groupId]);

  const handleSplitChange = (memberId, value) => {
    setSplits({ ...splits, [memberId]: value });
  };

  const handleEqualSplit = () => {
    if (!amount || members.length === 0) return;
    const splitAmount = (parseFloat(amount) / members.length).toFixed(2);
    const newSplits = {};
    members.forEach(m => newSplits[m.id] = splitAmount);
    setSplits(newSplits);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !amount || !groupId || !user?.id) return;

    // Build the exact map required by the backend
    const splitMap = {};
    Object.keys(splits).forEach(userId => {
      const val = parseFloat(splits[userId]);
      if (val > 0) {
        splitMap[userId] = val;
      }
    });

    const payload = {
      title,
      amount: parseFloat(amount),
      category: category || 'General',
      expenseDate,
      groupId: parseInt(groupId, 10),
      paidByUserId: user.id,
      splits: splitMap
    };

    setIsLoading(true);
    try {
      const response = await addExpense(payload);
      onAdd(response.data);
    } catch (error) {
      console.error('Error adding expense:', error);
      alert('Failed to add expense. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Title</label>
          <Input
            placeholder="e.g. Dinner, Taxi"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Amount ($)</label>
          <Input
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <Input
            placeholder="e.g. Food, Travel"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Date</label>
          <Input
            type="date"
            value={expenseDate}
            onChange={(e) => setExpenseDate(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium">Group</label>
          <select 
            className="flex h-10 w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
            required
          >
            <option value="" disabled>Select a group</option>
            {groups.map(g => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
        </div>
      </div>

      {members.length > 0 && (
        <div className="mt-6 border-t pt-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold">Expense Splits</h4>
            <Button type="button" variant="outline" size="sm" onClick={handleEqualSplit}>
              Split Equally
            </Button>
          </div>
          <div className="space-y-3">
            {members.map(member => (
              <div key={member.id} className="flex items-center justify-between">
                <span className="text-sm">{member.name} {member.id === user?.id ? '(You)' : ''}</span>
                <div className="flex items-center gap-2 w-1/3">
                  <span className="text-sm text-muted-foreground">$</span>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    className="h-8"
                    value={splits[member.id] || ''}
                    onChange={(e) => handleSplitChange(member.id, e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2 justify-end pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Expense'}
        </Button>
      </div>
    </form>
  );
};

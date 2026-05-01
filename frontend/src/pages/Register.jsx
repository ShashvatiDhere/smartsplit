import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register as registerApi } from '../api/endpoints';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { UserPlus } from 'lucide-react';
import bgImage from '../assets/register-bg.png';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await registerApi({ name, email, password, phone });
      navigate('/login');
    } catch (err) {
      console.error('Full Registration Error:', err);
      
      if (!err.response) {
        setError('Connection Refused: Is your backend running at http://127.0.0.1:8080/api?');
      } else {
        const data = err.response?.data;
        const status = err.response?.status;
        let serverMessage = 'Registration failed.';
        
        if (typeof data === 'string') {
          serverMessage = data;
        } else if (data?.message) {
          serverMessage = data.message;
        } else if (data?.error) {
          serverMessage = data.error;
        } else if (typeof data === 'object') {
          serverMessage = Object.entries(data)
            .map(([field, msg]) => `${field}: ${msg}`)
            .join(', ');
        }
        setError(`${serverMessage} (Status: ${status})`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 hover:scale-105"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="absolute inset-0 z-1 bg-slate-900/40 backdrop-blur-[2px]" />

      <Card className="w-full max-w-md relative z-10 glass animate-in">
        <CardHeader className="space-y-3 items-center text-center">
          <div className="bg-primary/20 p-3 rounded-2xl backdrop-blur-md">
            <UserPlus className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">Join SmartSplit</CardTitle>
          <p className="text-sm text-muted-foreground">Create an account to start splitting expenses easily</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-xl animate-in">
                {error}
              </div>
            )}
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold ml-1">Full Name</label>
                <Input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-white/50 border-white/30 focus:bg-white/80 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold ml-1">Email</label>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/50 border-white/30 focus:bg-white/80 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold ml-1">Phone</label>
                <Input
                  type="tel"
                  placeholder="+1 234 567 8900"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-white/50 border-white/30 focus:bg-white/80 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold ml-1">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="bg-white/50 border-white/30 focus:bg-white/80 transition-all"
                />
              </div>
            </div>
            <Button type="submit" className="w-full h-11 rounded-xl shadow-lg transition-all active:scale-95 mt-2" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Sign up'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center border-t border-white/10 mt-4">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-bold">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

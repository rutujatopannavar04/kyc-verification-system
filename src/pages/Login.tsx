import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, FieldProps } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Navbar } from '@/components/ui/Navbar';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/utils/api';
import { toast } from '@/hooks/use-toast';
import { Mail, Lock, Shield } from 'lucide-react';

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

interface LoginFormValues {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleSubmit = async (values: LoginFormValues, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    try {
      const response = await authApi.login(values);
      const { user, token } = response.data;
      
      login(user, token);
      
      toast({
        title: 'Welcome back!',
        description: `Logged in as ${user.fullName}`,
      });

      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Login failed',
        description: error.response?.data?.message || 'Invalid credentials',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Demo login for testing
  const handleDemoLogin = (role: 'user' | 'admin') => {
    const demoUsers = {
      user: { id: '1', email: 'user@demo.com', fullName: 'John Doe', role: 'user' as const },
      admin: { id: '2', email: 'admin@demo.com', fullName: 'Admin User', role: 'admin' as const },
    };
    
    login(demoUsers[role], 'demo-token-' + role);
    toast({
      title: 'Demo Login',
      description: `Logged in as ${demoUsers[role].fullName}`,
    });
    
    navigate(role === 'admin' ? '/admin' : '/dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="flex items-center justify-center min-h-screen px-4 pt-16">
        <div className="w-full max-w-md animate-scale-in">
          <Card variant="elevated" className="relative overflow-hidden">
            {/* Decorative gradient */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary-light to-primary" />
            
            <CardHeader className="text-center pb-2">
              <div className="mx-auto p-3 bg-accent rounded-xl w-fit mb-4">
                <Shield className="text-primary" size={28} />
              </div>
              <CardTitle className="text-2xl">Welcome Back</CardTitle>
              <CardDescription>Sign in to continue to VerifyKYC</CardDescription>
            </CardHeader>

            <CardContent>
              <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={loginSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, errors, touched }) => (
                  <Form className="space-y-4">
                    <Field name="email">
                      {({ field }: FieldProps) => (
                        <Input
                          {...field}
                          type="email"
                          label="Email"
                          placeholder="you@example.com"
                          icon={<Mail size={18} />}
                          error={touched.email && errors.email ? errors.email : undefined}
                        />
                      )}
                    </Field>

                    <Field name="password">
                      {({ field }: FieldProps) => (
                        <Input
                          {...field}
                          type="password"
                          label="Password"
                          placeholder="••••••••"
                          icon={<Lock size={18} />}
                          error={touched.password && errors.password ? errors.password : undefined}
                        />
                      )}
                    </Field>

                    <Button
                      type="submit"
                      variant="gradient"
                      className="w-full"
                      isLoading={isSubmitting}
                    >
                      Sign In
                    </Button>
                  </Form>
                )}
              </Formik>

              {/* Demo Buttons */}
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground text-center mb-3">
                  Try demo accounts
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleDemoLogin('user')}
                  >
                    User Demo
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleDemoLogin('admin')}
                  >
                    Admin Demo
                  </Button>
                </div>
              </div>

              <p className="text-center text-sm text-muted-foreground mt-6">
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary font-medium hover:underline">
                  Sign up
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;

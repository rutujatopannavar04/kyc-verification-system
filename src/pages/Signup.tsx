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
import { Mail, Lock, User, Shield, CheckCircle } from 'lucide-react';

const signupSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .required('Full name is required'),
  email: Yup.string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-z]/, 'Password must contain a lowercase letter')
    .matches(/[A-Z]/, 'Password must contain an uppercase letter')
    .matches(/[0-9]/, 'Password must contain a number')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

interface SignupFormValues {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleSubmit = async (values: SignupFormValues, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    try {
      const { confirmPassword, ...registerData } = values;
      const response = await authApi.register(registerData);
      const { user, token } = response.data;
      
      login(user, token);
      
      toast({
        title: 'Account created!',
        description: 'Welcome to VerifyKYC',
      });

      navigate('/dashboard');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Registration failed',
        description: error.response?.data?.message || 'Something went wrong',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Demo signup
  const handleDemoSignup = () => {
    const demoUser = { 
      id: '1', 
      email: 'newuser@demo.com', 
      fullName: 'New User', 
      role: 'user' as const 
    };
    
    login(demoUser, 'demo-token-new');
    toast({
      title: 'Demo Account Created',
      description: 'Welcome to VerifyKYC!',
    });
    
    navigate('/dashboard');
  };

  const passwordRequirements = [
    { label: 'At least 8 characters', regex: /.{8,}/ },
    { label: 'One uppercase letter', regex: /[A-Z]/ },
    { label: 'One lowercase letter', regex: /[a-z]/ },
    { label: 'One number', regex: /[0-9]/ },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="flex items-center justify-center min-h-screen px-4 py-24">
        <div className="w-full max-w-md animate-scale-in">
          <Card variant="elevated" className="relative overflow-hidden">
            {/* Decorative gradient */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary-light to-primary" />
            
            <CardHeader className="text-center pb-2">
              <div className="mx-auto p-3 bg-accent rounded-xl w-fit mb-4">
                <Shield className="text-primary" size={28} />
              </div>
              <CardTitle className="text-2xl">Create Account</CardTitle>
              <CardDescription>Join VerifyKYC and get verified today</CardDescription>
            </CardHeader>

            <CardContent>
              <Formik
                initialValues={{ fullName: '', email: '', password: '', confirmPassword: '' }}
                validationSchema={signupSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, errors, touched, values }) => (
                  <Form className="space-y-4">
                    <Field name="fullName">
                      {({ field }: FieldProps) => (
                        <Input
                          {...field}
                          type="text"
                          label="Full Name"
                          placeholder="John Doe"
                          icon={<User size={18} />}
                          error={touched.fullName && errors.fullName ? errors.fullName : undefined}
                        />
                      )}
                    </Field>

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
                        <div>
                          <Input
                            {...field}
                            type="password"
                            label="Password"
                            placeholder="••••••••"
                            icon={<Lock size={18} />}
                            error={touched.password && errors.password ? errors.password : undefined}
                          />
                          {/* Password Requirements */}
                          <div className="mt-2 space-y-1">
                            {passwordRequirements.map((req, index) => (
                              <div
                                key={index}
                                className={`flex items-center gap-2 text-xs ${
                                  req.regex.test(values.password)
                                    ? 'text-success'
                                    : 'text-muted-foreground'
                                }`}
                              >
                                <CheckCircle size={12} />
                                {req.label}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </Field>

                    <Field name="confirmPassword">
                      {({ field }: FieldProps) => (
                        <Input
                          {...field}
                          type="password"
                          label="Confirm Password"
                          placeholder="••••••••"
                          icon={<Lock size={18} />}
                          error={touched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : undefined}
                        />
                      )}
                    </Field>

                    <Button
                      type="submit"
                      variant="gradient"
                      className="w-full"
                      isLoading={isSubmitting}
                    >
                      Create Account
                    </Button>
                  </Form>
                )}
              </Formik>

              {/* Demo Button */}
              <div className="mt-6 pt-6 border-t border-border">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleDemoSignup}
                >
                  Try Demo Account
                </Button>
              </div>

              <p className="text-center text-sm text-muted-foreground mt-6">
                Already have an account?{' '}
                <Link to="/login" className="text-primary font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Signup;

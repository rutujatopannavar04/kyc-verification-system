import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, FieldProps } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { FileUpload } from '@/components/ui/FileUpload';
import { kycApi } from '@/utils/api';
import { toast } from '@/hooks/use-toast';
import { User, Mail, Phone, MapPin, CreditCard, ArrowLeft, Send } from 'lucide-react';

const kycSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .required('Full name is required'),
  email: Yup.string()
    .email('Please enter a valid email')
    .required('Email is required'),
  phone: Yup.string()
    .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/, 'Please enter a valid phone number')
    .required('Phone number is required'),
  address: Yup.string()
    .min(10, 'Address must be at least 10 characters')
    .max(200, 'Address must be less than 200 characters')
    .required('Address is required'),
  idNumber: Yup.string()
    .min(5, 'ID number must be at least 5 characters')
    .max(50, 'ID number must be less than 50 characters')
    .required('ID number is required'),
});

interface KYCFormValues {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  idNumber: string;
}

const KYCSubmit: React.FC = () => {
  const navigate = useNavigate();
  const [faceImage, setFaceImage] = useState<File | null>(null);
  const [idDocument, setIdDocument] = useState<File | null>(null);
  const [fileErrors, setFileErrors] = useState<{ faceImage?: string; idDocument?: string }>({});

  const validateFiles = () => {
    const errors: { faceImage?: string; idDocument?: string } = {};
    if (!faceImage) errors.faceImage = 'Face image is required';
    if (!idDocument) errors.idDocument = 'ID document is required';
    setFileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (values: KYCFormValues, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    if (!validateFiles()) {
      setSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append('faceImage', faceImage!);
      formData.append('idDocument', idDocument!);

      await kycApi.submit(formData);
      
      toast({
        title: 'KYC Submitted!',
        description: 'Your documents have been submitted for review.',
      });

      navigate('/dashboard/status');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Submission failed',
        description: error.response?.data?.message || 'Something went wrong',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Demo submit
  const handleDemoSubmit = () => {
    toast({
      title: 'Demo Submission',
      description: 'In demo mode, your KYC has been submitted successfully!',
    });
    navigate('/dashboard/status');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/dashboard')}
          className="gap-2"
        >
          <ArrowLeft size={16} />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Submit KYC Documents</h1>
          <p className="text-muted-foreground text-sm">Fill in your details and upload required documents</p>
        </div>
      </div>

      <Card variant="elevated" className="animate-scale-in">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Please provide accurate information as it appears on your ID</CardDescription>
        </CardHeader>

        <CardContent>
          <Formik
            initialValues={{
              fullName: '',
              email: '',
              phone: '',
              address: '',
              idNumber: '',
            }}
            validationSchema={kycSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="space-y-6">
                {/* Personal Details */}
                <div className="grid md:grid-cols-2 gap-4">
                  <Field name="fullName">
                    {({ field }: FieldProps) => (
                      <Input
                        {...field}
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

                  <Field name="phone">
                    {({ field }: FieldProps) => (
                      <Input
                        {...field}
                        label="Phone Number"
                        placeholder="+1 (555) 000-0000"
                        icon={<Phone size={18} />}
                        error={touched.phone && errors.phone ? errors.phone : undefined}
                      />
                    )}
                  </Field>

                  <Field name="idNumber">
                    {({ field }: FieldProps) => (
                      <Input
                        {...field}
                        label="ID Number"
                        placeholder="Enter your ID number"
                        icon={<CreditCard size={18} />}
                        error={touched.idNumber && errors.idNumber ? errors.idNumber : undefined}
                      />
                    )}
                  </Field>
                </div>

                <Field name="address">
                  {({ field }: FieldProps) => (
                    <Input
                      {...field}
                      label="Full Address"
                      placeholder="123 Main St, City, Country"
                      icon={<MapPin size={18} />}
                      error={touched.address && errors.address ? errors.address : undefined}
                    />
                  )}
                </Field>

                {/* Document Uploads */}
                <div className="pt-6 border-t border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Document Uploads</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <FileUpload
                      label="Face Photo"
                      accept="image/*"
                      icon="image"
                      onChange={(file) => {
                        setFaceImage(file);
                        if (file) setFileErrors(prev => ({ ...prev, faceImage: undefined }));
                      }}
                      error={fileErrors.faceImage}
                    />

                    <FileUpload
                      label="ID Document"
                      accept="image/*,.pdf"
                      icon="document"
                      onChange={(file) => {
                        setIdDocument(file);
                        if (file) setFileErrors(prev => ({ ...prev, idDocument: undefined }));
                      }}
                      error={fileErrors.idDocument}
                    />
                  </div>

                  <p className="text-xs text-muted-foreground mt-4">
                    Supported formats: JPG, PNG, PDF. Maximum file size: 10MB
                  </p>
                </div>

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    type="submit"
                    variant="gradient"
                    className="flex-1 gap-2"
                    isLoading={isSubmitting}
                  >
                    <Send size={16} />
                    Submit KYC
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDemoSubmit}
                  >
                    Demo Submit
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  );
};

export default KYCSubmit;

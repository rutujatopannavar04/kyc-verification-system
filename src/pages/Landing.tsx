import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, CheckCircle, Lock, Upload, ArrowRight, FileCheck, Users } from 'lucide-react';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-soft" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-float" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full text-primary-light text-sm font-medium mb-8 animate-fade-in">
              <Shield size={16} />
              Trusted by 10,000+ businesses worldwide
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight animate-slide-up">
              Verify Identity with{' '}
              <span className="text-gradient">Confidence</span>
            </h1>
            
            <p className="text-lg md:text-xl text-primary-foreground/70 mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Upload your KYC documents securely and get verified in minutes. 
              Our AI-powered system ensures fast, accurate, and compliant verification.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link to="/signup">
                <Button variant="gradient" size="lg" className="gap-2">
                  Get Started Free
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                  Sign In
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 mt-16 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              {[
                { icon: Lock, text: 'Bank-Grade Security' },
                { icon: CheckCircle, text: '99.9% Accuracy' },
                { icon: Upload, text: 'Easy Upload' },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-primary-foreground/60">
                  <item.icon size={18} className="text-primary-light" />
                  <span className="text-sm font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose VerifyKYC?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive KYC solution offers everything you need for secure, 
              compliant identity verification.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Upload,
                title: 'Simple Upload',
                description: 'Drag and drop your documents or capture them with your camera. Our system accepts all major ID types.',
              },
              {
                icon: FileCheck,
                title: 'Fast Verification',
                description: 'AI-powered verification processes your documents in minutes, not days. Get verified quickly.',
              },
              {
                icon: Shield,
                title: 'Secure & Compliant',
                description: 'Your data is encrypted and stored securely. We comply with GDPR, PCI-DSS, and other regulations.',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="card-elevated p-8 group hover:shadow-glow transition-all duration-300"
              >
                <div className="p-3 bg-accent rounded-xl w-fit mb-6 group-hover:bg-primary transition-colors duration-300">
                  <feature.icon className="text-primary group-hover:text-primary-foreground transition-colors duration-300" size={28} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            {[
              { value: '50K+', label: 'Users Verified' },
              { value: '99.9%', label: 'Accuracy Rate' },
              { value: '<2min', label: 'Average Time' },
            ].map((stat, index) => (
              <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">{stat.value}</div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="card-glass max-w-4xl mx-auto text-center p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Get Verified?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Join thousands of users who trust VerifyKYC for secure identity verification.
            </p>
            <Link to="/signup">
              <Button variant="gradient" size="lg" className="gap-2">
                Start Verification
                <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary rounded-lg">
                <Shield className="text-primary-foreground" size={16} />
              </div>
              <span className="font-bold text-foreground">VerifyKYC</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 VerifyKYC. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { User, Phone, Mail, Send } from 'lucide-react';
import type { ComplaintFormData } from '@/lib/types';

interface StepContactProps {
  data: ComplaintFormData;
  updateData: (updates: Partial<ComplaintFormData>) => void;
}

const StepContact = ({ data, updateData }: StepContactProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-100 mb-3">
          <Send className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
          Contact Information
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
          We'll use this to send you updates about your complaint
        </p>
      </div>

      <div className="space-y-5">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <User className="w-4 h-4 text-slate-400" aria-hidden="true" />
            Full Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your full name"
            value={data.name}
            onChange={(e) => updateData({ name: e.target.value })}
            className="h-11 rounded-xl"
            required
            aria-required="true"
          />
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Phone className="w-4 h-4 text-slate-400" aria-hidden="true" />
            Phone Number <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-medium">+91</span>
            <Input
              id="phone"
              type="tel"
              placeholder="10-digit mobile number"
              value={data.phone}
              onChange={(e) => updateData({ phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
              className="h-11 rounded-xl pl-12 font-mono"
              pattern="[0-9]{10}"
              maxLength={10}
              required
              aria-required="true"
              aria-describedby="phone-hint"
            />
          </div>
          <p id="phone-hint" className="text-xs text-slate-400">
            We'll send SMS updates to this number
          </p>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Mail className="w-4 h-4 text-slate-400" aria-hidden="true" />
            Email Address <span className="text-slate-300 text-xs font-normal ml-1">(Optional)</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email address"
            value={data.email}
            onChange={(e) => updateData({ email: e.target.value })}
            className="h-11 rounded-xl"
            aria-describedby="email-hint"
          />
          <p id="email-hint" className="text-xs text-slate-400">
            For receiving detailed updates via email
          </p>
        </div>

        {/* Consent */}
        <div className="mt-8 p-5 bg-primary/5 rounded-xl border border-primary/10">
          <div className="flex items-start gap-3">
            <Checkbox
              id="consent"
              checked={data.consent}
              onCheckedChange={(checked) => updateData({ consent: checked as boolean })}
              className="mt-0.5"
              aria-required="true"
            />
            <Label htmlFor="consent" className="text-sm leading-relaxed cursor-pointer text-slate-600 dark:text-slate-400">
              I consent to the collection and processing of my personal data for the purpose
              of addressing my complaint. I understand my information will be handled
              in accordance with the Government Data Protection Guidelines.
              <span className="text-red-500 ml-1">*</span>
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepContact;

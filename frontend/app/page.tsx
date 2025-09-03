
import React from 'react';
import Link from 'next/link';
import { BarChart3, ShieldCheck, Users, FileText, PieChart, Group, Download } from 'lucide-react';

// Card for ESG metric types
interface MetricTypeCardProps {
  title: string;
  subtitle: string;
  desc: string;
}

function MetricTypeCard(props: MetricTypeCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition">
      <h3 className="font-bold text-lg text-gray-900 mb-1">{props.title}</h3>
      <span className="text-emerald-600 font-semibold mb-2">{props.subtitle}</span>
      <p className="text-gray-500 text-sm mb-2">{props.desc}</p>
    </div>
  );
}

// Feature card component
function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition">
      <div className="mb-4">{icon}</div>
      <h3 className="font-bold text-lg text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm">{desc}</p>
    </div>
  );
}

// (Optional) Metric summary card for dashboard (not used yet)
function MetricCard({ title, value, subtitle }: { title: string; value: string; subtitle: string }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition">
      <h3 className="font-bold text-lg text-gray-900 mb-2">{title}</h3>
      <span className="text-3xl font-extrabold text-emerald-600 mb-2">{value}</span>
      <span className="text-gray-500 text-sm">{subtitle}</span>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-emerald-50 to-white">
      {/* Navbar */}
      <nav className="w-full bg-white shadow-sm px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-bold text-emerald-600 text-xl">OrenOne</span>
        </div>
        <div className="flex-1 flex justify-center">
          <Link href="/" className="text-emerald-400 hover:text-emerald-600 font-medium text-lg">Home</Link>
        </div>
        <div className="flex gap-3">
          <Link href="/auth/login" className="px-4 py-2 rounded-lg bg-white border border-emerald-600 text-emerald-600 font-semibold hover:bg-emerald-50 transition">Login</Link>
          <Link href="/auth/register" className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition">Sign Up</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="bg-emerald-100 rounded-full p-4 mb-6">
          <BarChart3 className="w-12 h-12 text-emerald-600" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900">
          All Your <span className="text-emerald-600">Sustainability Data</span> <br />
          and <span className="text-emerald-600">Stakeholders Connected</span> <br />
          in One Place
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Comprehensive ESG questionnaire and sustainability data management platform. 
          Track, analyze, and report your environmental, social, and governance metrics with ease.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/register" className="px-8 py-3 rounded-lg bg-emerald-600 text-white font-bold text-lg shadow-md hover:bg-emerald-700 transition">Get Started Free</Link>
          <Link href="/auth/login" className="px-8 py-3 rounded-lg bg-white border border-emerald-600 text-emerald-600 font-bold text-lg shadow-md hover:bg-emerald-50 transition">Sign In</Link>
        </div>
      </section>

      {/* Auto-calculated ESG Metrics Section */}
      <section className="w-full bg-gradient-to-b from-emerald-50 to-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Auto-calculated ESG Metrics</h2>
          <p className="text-lg text-gray-600">Our platform automatically calculates key sustainability indicators from your input data, giving you instant insights for smarter decisions.</p>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <MetricTypeCard title="Carbon Intensity" subtitle="T CO2e / INR" desc="Measure your carbon emissions per unit of financial output." />
          <MetricTypeCard title="Renewable Energy Ratio" subtitle="% Clean Energy" desc="Track the percentage of energy sourced from renewables." />
          <MetricTypeCard title="Diversity Ratio" subtitle="Gender Diversity" desc="Monitor gender diversity metrics across your organization." />
          <MetricTypeCard title="Community Investment" subtitle="Social Impact" desc="See your social impact spending and community investments." />
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Everything you need for ESG reporting</h2>
        <p className="text-gray-600 text-center mb-10">Explore our advanced questionnaire types and platform features designed for seamless ESG data collection and analysis.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard icon={<BarChart3 className="w-8 h-8 text-emerald-600" />} title="Annual ESG Questionnaire" desc="Capture yearly sustainability data for comprehensive reporting." />
          <FeatureCard icon={<PieChart className="w-8 h-8 text-emerald-600" />} title="Quick Survey" desc="Short, focused surveys for rapid stakeholder feedback." />
          <FeatureCard icon={<ShieldCheck className="w-8 h-8 text-emerald-600" />} title="Compliance Checklist" desc="Ensure your organization meets all regulatory requirements." />
          <FeatureCard icon={<Download className="w-8 h-8 text-emerald-600" />} title="Real-time Updates" desc="Instantly see changes and updates as you input data." />
          <FeatureCard icon={<Group className="w-8 h-8 text-emerald-600" />} title="Team Collaboration" desc="Invite team members to contribute and review ESG data." />
          <FeatureCard icon={<FileText className="w-8 h-8 text-emerald-600" />} title="Export & Reports" desc="Download detailed reports and export your data in multiple formats." />
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-gray-200 py-8 px-6 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-bold text-emerald-600 text-lg">OrenOne</span>
          <span className="text-gray-500">Empowering sustainable decisions</span>
        </div>
        <div className="flex gap-6 mt-4 md:mt-0">
          <Link href="/auth/login" className="text-gray-700 hover:text-emerald-600 font-medium">Dashboard</Link>
          <Link href="/auth/login" className="text-gray-700 hover:text-emerald-600 font-medium">ESG Questionnaire</Link>
          <Link href="/auth/login" className="text-gray-700 hover:text-emerald-600 font-medium">Download PDF/Excel</Link>
        </div>
      </footer>
    </div>
  )
}

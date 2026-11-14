'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { College } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input, Select, Textarea } from '@/components/ui/Form';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/Common';
import {
  Building2,
  PlusCircle,
  Edit,
  ArrowLeft,
  MapPin,
} from 'lucide-react';

export default function AdminCollegesPage() {
  const { colleges, addCollege, updateCollege, showToast } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCollege, setEditingCollege] = useState<College | null>(null);

  // Form State
  const [shortName, setShortName] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<'Engineering' | 'Medical' | 'Law'>('Engineering');
  const [branchesStr, setBranchesStr] = useState('CSE, IT, ECE');
  const [description, setDescription] = useState('');

  const openAddModal = () => {
    setEditingCollege(null);
    setShortName('');
    setName('');
    setLocation('');
    setCategory('Engineering');
    setBranchesStr('CSE, IT, ECE');
    setDescription('');
    setModalOpen(true);
  };

  const openEditModal = (col: College) => {
    setEditingCollege(col);
    setShortName(col.short_name);
    setName(col.name);
    setLocation(col.location);
    setCategory(col.category);
    setBranchesStr(col.branches.join(', '));
    setDescription(col.description || '');
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shortName.trim() || !name.trim() || !location.trim()) {
      showToast('Please fill all required fields');
      return;
    }

    const branches = branchesStr
      .split(',')
      .map((b) => b.trim())
      .filter(Boolean);

    if (editingCollege) {
      updateCollege(editingCollege.id, {
        short_name: shortName,
        name,
        location,
        category,
        branches,
        description,
      });
    } else {
      const slug = shortName.toLowerCase().replace(/[^a-z0-9]/g, '');
      const newCol: College = {
        id: slug || `col-${Date.now()}`,
        slug: slug || `col-${Date.now()}`,
        short_name: shortName,
        name,
        location,
        category,
        isActive: true,
        branches,
        description,
      };
      addCollege(newCol);
    }

    setModalOpen(false);
  };

  return (
    <div className="container-x py-8 sm:py-10">
      {/* Header */}
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1 text-xs font-semibold text-ink-500 transition-colors hover:text-ink-900"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Admin Overview
            </Link>
            <span className="text-ink-300">•</span>
            <Badge tone="red" size="sm">
              <Building2 className="h-3 w-3" /> Directory Management
            </Badge>
          </div>
          <h1 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-ink-950 sm:text-3xl">
            College &amp; Department Management
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-ink-500">
            Add or update Delhi colleges, verified branch catalogs, and configure upcoming faculty categories.
          </p>
        </div>

        <Button variant="primary" size="md" onClick={openAddModal} className="shrink-0">
          <PlusCircle className="h-4 w-4" />
          <span>Add New College</span>
        </Button>
      </div>

      {/* College List */}
      {colleges.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No colleges in the directory yet"
          description="Add your first campus institution to enable student filtering across the platform."
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {colleges.map((col) => (
            <div
              key={col.id}
              className="flex flex-col justify-between rounded-2xl border border-ink-200 bg-white p-6 shadow-card transition-all hover:shadow-lift"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <Badge tone="red">{col.short_name}</Badge>

                  <div className="flex items-center gap-2">
                    <Badge tone={col.isActive ? 'green' : 'red'} size="sm">
                      {col.isActive ? 'Active' : 'Disabled'}
                    </Badge>
                    <button
                      onClick={() => updateCollege(col.id, { isActive: !col.isActive })}
                      className="text-xs font-bold text-ink-400 underline-offset-2 transition hover:text-ink-700 hover:underline"
                    >
                      Toggle
                    </button>
                  </div>
                </div>

                <h3 className="font-display text-base font-extrabold leading-snug text-ink-950">
                  {col.name}
                </h3>

                <div className="flex items-center gap-1.5 text-xs text-ink-500">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-brand-600" />
                  <span>{col.location}</span>
                </div>

                <div className="border-t border-ink-100 pt-3">
                  <span className="mb-1.5 block text-[10px] font-extrabold uppercase tracking-widest text-ink-400">
                    Branches ({col.branches.length})
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {col.branches.map((b) => (
                      <Badge key={b} tone="outline" size="sm">
                        {b}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 border-t border-ink-100 pt-4">
                <Button
                  variant="darkOutline"
                  size="sm"
                  block
                  onClick={() => openEditModal(col)}
                >
                  <Edit className="h-3.5 w-3.5" />
                  <span>Edit Details &amp; Branches</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Add / Edit */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCollege ? `Edit ${editingCollege.short_name}` : 'Add New College'}
        description="College records power campus filtering across the entire marketplace."
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Abbreviation (e.g. MAIT)"
              value={shortName}
              onChange={(e) => setShortName(e.target.value)}
              required
            />
            <Select
              label="Category Type"
              value={category}
              onChange={(e) => setCategory(e.target.value as 'Engineering' | 'Medical' | 'Law')}
            >
              <option value="Engineering">Engineering</option>
              <option value="Medical">Medical (Coming Soon)</option>
              <option value="Law">Law (Coming Soon)</option>
            </Select>
          </div>

          <Input
            label="Full College Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="Campus Location (e.g. Rohini, Delhi)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />

          <Input
            label="Branches (Comma separated)"
            placeholder="CSE, IT, ECE, ME, Civil"
            value={branchesStr}
            onChange={(e) => setBranchesStr(e.target.value)}
            helper="Verified branches available for student filtering."
            required
          />

          <Textarea
            label="Description / Campus Notes"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex gap-2 border-t border-ink-100 pt-4">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className="w-1/2">
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="w-1/2">
              Save College Record
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

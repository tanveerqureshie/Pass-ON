'use client';

import React from 'react';
import { FilterState } from '@/lib/types';
import { useApp } from '@/context/AppContext';
import { RotateCcw, Gift, Filter } from 'lucide-react';
import { Select } from '@/components/ui/Form';
import clsx from 'clsx';

interface FilterSidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  totalCount: number;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, setFilters, totalCount }) => {
  const { colleges, categories, selectedCollegeId } = useApp();

  const handleReset = () => {
    setFilters({
      searchQuery: '',
      collegeId: 'all',
      branch: 'all',
      categoryId: 'all',
      listingType: 'all',
      condition: 'all',
      isFreeOnly: false,
      minPrice: '',
      maxPrice: '',
      sortBy: 'newest',
      mode: 'all',
    });
  };

  const selectedColObj = colleges.find((c) => c.id === filters.collegeId);
  const availableBranches =
    filters.collegeId !== 'all' && selectedColObj
      ? selectedColObj.branches
      : Array.from(new Set(colleges.flatMap((c) => c.branches))).sort();

  return (
    <div className="space-y-5 rounded-2xl border border-ink-200 bg-white p-5 shadow-card">
      {/* Header & Reset */}
      <div className="flex items-center justify-between border-b border-ink-100 pb-4">
        <span className="flex items-center gap-2 text-sm font-extrabold text-ink-950">
          <Filter className="h-4 w-4 text-brand-600" />
          Filters
          <span className="rounded-full bg-ink-100 px-2 py-0.5 text-[10px] font-bold text-ink-600">{totalCount}</span>
        </span>
        <button
          onClick={handleReset}
          className="flex items-center gap-1 text-xs font-semibold text-ink-500 transition hover:text-brand-600"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reset
        </button>
      </div>

      {/* Mode switcher */}
      <div>
        <p className="label-base">Browsing Mode</p>
        <div className="grid grid-cols-2 gap-1 rounded-xl border border-ink-200 bg-ink-100 p-1">
          <button
            onClick={() => setFilters((p) => ({ ...p, mode: 'my_college', collegeId: selectedCollegeId }))}
            className={clsx(
              'rounded-lg px-2 py-2 text-xs font-bold transition',
              filters.mode === 'my_college' ? 'bg-white text-ink-950 shadow-chip' : 'text-ink-600 hover:text-ink-950'
            )}
          >
            My Campus
          </button>
          <button
            onClick={() => setFilters((p) => ({ ...p, mode: 'all', collegeId: 'all' }))}
            className={clsx(
              'rounded-lg px-2 py-2 text-xs font-bold transition',
              filters.mode === 'all' ? 'bg-white text-ink-950 shadow-chip' : 'text-ink-600 hover:text-ink-950'
            )}
          >
            All Colleges
          </button>
        </div>
      </div>

      {/* Free-only toggle */}
      <label className="flex cursor-pointer select-none items-center gap-2.5 rounded-xl border border-ink-200 bg-ink-50 p-3 transition hover:border-ink-300">
        <input
          type="checkbox"
          checked={filters.isFreeOnly}
          onChange={(e) =>
            setFilters((p) => ({
              ...p,
              isFreeOnly: e.target.checked,
              listingType: e.target.checked ? 'free' : 'all',
            }))
          }
          className="h-4 w-4 cursor-pointer rounded accent-brand-600"
        />
        <span className="flex items-center gap-1.5 text-xs font-bold text-ink-900">
          <Gift className="h-3.5 w-3.5 text-brand-600" /> Free items only (₹0)
        </span>
      </label>

      {/* College */}
      {filters.mode === 'all' && (
        <Select
          label="College / Institute"
          value={filters.collegeId}
          onChange={(e) => setFilters((p) => ({ ...p, collegeId: e.target.value, branch: 'all' }))}
          className="text-xs"
        >
          <option value="all">All Delhi Colleges</option>
          {colleges.map((c) => (
            <option key={c.id} value={c.id}>
              {c.short_name} — {c.location}
            </option>
          ))}
        </Select>
      )}

      {/* Branch */}
      <Select
        label="Branch / Department"
        value={filters.branch}
        onChange={(e) => setFilters((p) => ({ ...p, branch: e.target.value }))}
        className="text-xs"
      >
        <option value="all">All Branches</option>
        {availableBranches.map((br) => (
          <option key={br} value={br}>
            {br}
          </option>
        ))}
      </Select>

      {/* Category */}
      <Select
        label="Category"
        value={filters.categoryId}
        onChange={(e) => setFilters((p) => ({ ...p, categoryId: e.target.value }))}
        className="text-xs"
      >
        <option value="all">All Categories</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </Select>

      {/* Listing type */}
      <div>
        <p className="label-base">Listing Type</p>
        <div className="space-y-1.5">
          {[
            { id: 'all', label: 'All Listings' },
            { id: 'sell', label: 'Sell (Student Price)' },
            { id: 'free', label: 'Free Giveaway (₹0)' },
            { id: 'borrow', label: 'Borrow / Lend' },
            { id: 'exchange', label: 'Exchange' },
          ].map((type) => (
            <label
              key={type.id}
              className={clsx(
                'flex cursor-pointer select-none items-center justify-between rounded-xl border p-2.5 text-xs transition',
                filters.listingType === type.id
                  ? 'border-brand-300 bg-brand-50 font-bold text-brand-800'
                  : 'border-ink-200 bg-white font-medium text-ink-700 hover:bg-ink-50'
              )}
            >
              <span>{type.label}</span>
              <input
                type="radio"
                name="listingType"
                value={type.id}
                checked={filters.listingType === type.id}
                onChange={(e) =>
                  setFilters((p) => ({
                    ...p,
                    listingType: e.target.value,
                    isFreeOnly: e.target.value === 'free',
                  }))
                }
                className="accent-brand-600"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <p className="label-base">Price Range (₹)</p>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            min={0}
            placeholder="Min ₹"
            value={filters.minPrice}
            onChange={(e) =>
              setFilters((p) => ({ ...p, minPrice: e.target.value === '' ? '' : Number(e.target.value) }))
            }
            className="input-base text-xs"
          />
          <input
            type="number"
            min={0}
            placeholder="Max ₹"
            value={filters.maxPrice}
            onChange={(e) =>
              setFilters((p) => ({ ...p, maxPrice: e.target.value === '' ? '' : Number(e.target.value) }))
            }
            className="input-base text-xs"
          />
        </div>
      </div>

      {/* Sort */}
      <Select
        label="Sort Order"
        value={filters.sortBy}
        onChange={(e) => setFilters((p) => ({ ...p, sortBy: e.target.value as FilterState['sortBy'] }))}
        className="text-xs"
      >
        <option value="newest">Recently Added</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="popular">Most Viewed</option>
      </Select>
    </div>
  );
};

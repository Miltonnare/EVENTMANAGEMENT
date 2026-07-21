import React from 'react';

const SkeletonCard = () => (
  <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-col gap-4 animate-fade-in">
    <div className="w-full h-44 rounded-xl skeleton-shimmer" />
    <div className="flex flex-col gap-2">
      <div className="h-6 w-3/4 rounded-md skeleton-shimmer" />
      <div className="h-4 w-1/2 rounded-md skeleton-shimmer" />
    </div>
    <div className="h-12 w-full rounded-xl skeleton-shimmer mt-2" />
  </div>
);

const SkeletonTableRow = () => (
  <tr className="border-b border-slate-800/60">
    <td className="p-4"><div className="h-5 w-32 rounded skeleton-shimmer" /></td>
    <td className="p-4"><div className="h-5 w-24 rounded skeleton-shimmer" /></td>
    <td className="p-4"><div className="h-5 w-20 rounded skeleton-shimmer" /></td>
    <td className="p-4"><div className="h-8 w-24 rounded-lg skeleton-shimmer" /></td>
  </tr>
);

const SkeletonDetail = () => (
  <div className="max-w-5xl mx-auto p-6 flex flex-col gap-6 animate-fade-in">
    <div className="w-full h-80 rounded-2xl skeleton-shimmer" />
    <div className="h-10 w-2/3 rounded-lg skeleton-shimmer" />
    <div className="flex gap-4">
      <div className="h-6 w-28 rounded skeleton-shimmer" />
      <div className="h-6 w-28 rounded skeleton-shimmer" />
    </div>
    <div className="h-32 w-full rounded-xl skeleton-shimmer" />
  </div>
);

const SkeletonLoader = ({ count = 3, type = 'card', className = '' }) => {
  const items = Array.from({ length: count });

  if (type === 'table') {
    return (
      <tbody className={className}>
        {items.map((_, i) => (
          <SkeletonTableRow key={i} />
        ))}
      </tbody>
    );
  }

  if (type === 'detail') {
    return <SkeletonDetail />;
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {items.map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};

export default SkeletonLoader;

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { getRouteByPath, RouteBreadcrumb, BASE_URL } from '../routes-registry.ts';

interface BreadcrumbsProps {
  customBreadcrumbs?: RouteBreadcrumb[];
  className?: string;
}

/**
 * Universal Breadcrumbs component reading EXCLUSIVELY from routes-registry.
 * Renders semantic navigation with schema.org BreadcrumbList microdata.
 */
const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ customBreadcrumbs, className = '' }) => {
  const location = useLocation();

  // Root homepage does not display breadcrumbs
  if (location.pathname === '/' || location.pathname === '') {
    return null;
  }

  const route = getRouteByPath(location.pathname);
  const breadcrumbs: RouteBreadcrumb[] = customBreadcrumbs || (route ? route.breadcrumbs : [
    { name: 'Home', path: '/' },
    { name: 'Tools', path: '/tools/' }
  ]);

  if (!breadcrumbs || breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav aria-label="breadcrumb" className={`py-3 ${className}`}>
      <ol 
        itemScope 
        itemType="https://schema.org/BreadcrumbList"
        className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400"
      >
        {breadcrumbs.map((crumb, idx) => {
          const isLast = idx === breadcrumbs.length - 1;
          const absoluteUrl = `${BASE_URL}${crumb.path === '/' ? '' : crumb.path}`;

          return (
            <li
              key={crumb.path}
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
              className="flex items-center gap-1.5"
            >
              {idx > 0 && (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 flex-shrink-0" />
              )}

              {isLast ? (
                <span 
                  itemProp="name" 
                  className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1 max-w-[280px] sm:max-w-none"
                >
                  {crumb.name}
                </span>
              ) : (
                <Link
                  itemProp="item"
                  to={crumb.path}
                  className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-1"
                >
                  {idx === 0 && <Home className="w-3 h-3 text-slate-400" />}
                  <span itemProp="name">{crumb.name}</span>
                </Link>
              )}

              <meta itemProp="position" content={String(idx + 1)} />
              <link itemProp="item" href={absoluteUrl} />
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;

import { Link } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  currentPage: string;
  parentPath?: string;
  parentName?: string;
}

export default function PageHeader({ 
  title, 
  currentPage, 
  parentPath = '/', 
  parentName = 'Home' 
}: PageHeaderProps) {
  return (
    <div className="page-header-banner">
      <div className="container">
        <h1 className="page-banner-title">{title}</h1>
        <div className="page-breadcrumbs">
          <Link to={parentPath}>{parentName}</Link>
          <span className="breadcrumbs-separator">/</span>
          <span>{currentPage}</span>
        </div>
      </div>
    </div>
  );
}

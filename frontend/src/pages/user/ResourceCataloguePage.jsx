import React from 'react';
import { Compass } from 'lucide-react';

const ResourceCataloguePage = () => {
  return (
    <div className="container mx-auto px-4 py-12 min-h-[60vh] flex flex-col items-center justify-center text-slate-500">
      <div className="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 p-4 rounded-full mb-6">
        <Compass className="h-10 w-10" />
      </div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Resource Catalogue</h1>
      <p className="text-center max-w-md mb-8 leading-relaxed">
        This is a placeholder for the User Side resource catalogue. 
        In the upcoming phases we will build out the Search, Filters, and Resource Cards here.
      </p>
    </div>
  );
};

export default ResourceCataloguePage;

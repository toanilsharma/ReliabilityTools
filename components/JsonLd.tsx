import React from 'react';
import { Helmet } from 'react-helmet-async';

interface JsonLdProps {
  schema: any | any[];
}

const JsonLd: React.FC<JsonLdProps> = ({ schema }) => {
  if (!schema) return null;

  const schemasToRender = Array.isArray(schema) ? schema.filter(Boolean) : [schema];

  return (
    <Helmet>
      {schemasToRender.map((s, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  );
};

export default JsonLd;

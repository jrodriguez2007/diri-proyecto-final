import React, { useState } from 'react';
import { Tree, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { TreeNode } from '@/utils/TreeNode';

// Props para TreeTemplate, que recibe un array de nodos
interface TreeTemplateProps {
  treeData: TreeNode[];
  searchPlaceholder?: string;
  onSelect?: (selectedKey: string) => void;
}

// Nodo con título ya renderizado (resaltado si aplica)
interface RenderedTreeNode {
  key: string;
  title: React.ReactNode;
  children?: RenderedTreeNode[];
}

// Función para generar una lista de nodos a partir del árbol
const generateList = (data: TreeNode[], list: TreeNode[] = []): TreeNode[] => (
  data.forEach(({ key, title, children }) => {
    list.push({ key, title });
    if (children) generateList(children, list);
  }), list
);

// COMPONENTE TREE TEMPLATE
export const TreeTemplate: React.FC<TreeTemplateProps> = ({ 
  treeData, 
  searchPlaceholder = "Buscar nodos", 
  onSelect 
}) => {
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]); // Claves de los nodos expandidos
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]); // Claves de los nodos seleccionados
  const [searchValue, setSearchValue] = useState(''); // Valor de búsqueda
  const [autoExpandParent, setAutoExpandParent] = useState(true); // Si se debe expandir automáticamente el padre de los nodos encontrados

  const dataList = generateList(treeData);

  // Obtener la clave del nodo padre de un nodo dado
  const getParentKey = (key: string, tree: TreeNode[]): string | undefined => {
    for (const node of tree) {
      if (node.children?.some(child => child.key === key)) return node.key;
      const parentKey = node.children && getParentKey(key, node.children);
      if (parentKey) return parentKey;
    }
    return undefined;
  };

  // Manejar búsqueda en el input
  const handleSearch = (value: string): void => {
    const lowerValue = value.toLowerCase();
    const matchedKeys = dataList
      .map(item => item.title.toLowerCase().includes(lowerValue) ? getParentKey(item.key, treeData) : undefined)
      .filter((key, i, self): key is string => !!key && self.indexOf(key) === i);

    setExpandedKeys(matchedKeys);
    setSearchValue(value);
    setAutoExpandParent(true);
  };

  // Renderizar los nodos del árbol con resaltado de búsqueda
  const renderTreeNodes = (data: TreeNode[]): RenderedTreeNode[] =>
    data.map(({ key, title, children }) => {
      const lowerTitle = title.toLowerCase(), lowerSearch = searchValue.toLowerCase();
      const index = lowerTitle.indexOf(lowerSearch);

      const highlightedTitle = index > -1 ? (
        <span>
          {title.slice(0, index)}
          <span className="bg-red-100 font-bold">{title.slice(index, index + searchValue.length)}</span>
          {title.slice(index + searchValue.length)}
        </span>
      ) : <span>{title}</span>;

      return { key, title: highlightedTitle, children: children && renderTreeNodes(children) };
    });

  return (
    <div>
      {/* Input de búsqueda para filtrar nodos */}
      <Input
        prefix={<SearchOutlined />}
        placeholder={searchPlaceholder}
        onChange={e => handleSearch(e.target.value)}
        style={{ marginBottom: 8 }}
      />

      {/* Componente Tree de Ant Design */}
      <Tree
        checkable
        showLine
        showIcon={false}
        expandedKeys={expandedKeys}
        onExpand={keys => {
          setExpandedKeys(keys as string[]);
          setAutoExpandParent(false);
        }}
        autoExpandParent={autoExpandParent}
        checkedKeys={checkedKeys}
        onCheck={keys => setCheckedKeys(Array.isArray(keys) ? keys : keys.checked)}
        // Se agrega el evento onSelect que llama al callback recibido en las props
        onSelect={(selectedKeys) => {
          if (onSelect && selectedKeys.length > 0) {
            onSelect(selectedKeys[0].toString());
          }
        }}
        treeData={renderTreeNodes(treeData)}
      />
    </div>
  );
};


import React, { useState, useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Type, 
  Square, 
  Image, 
  MousePointer, 
  Layout,
  Trash2,
  Copy,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ComponentProps {
  id: string;
  type: 'text' | 'button' | 'image' | 'container' | 'card';
  content: string;
  styles: Record<string, any>;
  children?: ComponentProps[];
}

interface DroppableComponentProps {
  component: ComponentProps;
  onUpdate: (id: string, updates: Partial<ComponentProps>) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const componentTypes = [
  { type: 'text', label: 'Text', icon: Type, defaultContent: 'Sample Text' },
  { type: 'button', label: 'Button', icon: MousePointer, defaultContent: 'Click Me' },
  { type: 'image', label: 'Image', icon: Image, defaultContent: 'https://via.placeholder.com/200x150' },
  { type: 'container', label: 'Container', icon: Layout, defaultContent: '' },
  { type: 'card', label: 'Card', icon: Square, defaultContent: 'Card Content' },
];

const DraggableComponent: React.FC<DroppableComponentProps> = ({ 
  component, 
  onUpdate, 
  onDelete, 
  onDuplicate, 
  isSelected, 
  onSelect 
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'component',
    item: { id: component.id, type: component.type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: 'component',
    drop: (item: any) => {
      // Handle reordering logic here
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const renderComponent = () => {
    switch (component.type) {
      case 'text':
        return (
          <div 
            className="p-2 min-h-[40px] cursor-pointer"
            style={component.styles}
            onClick={() => onSelect(component.id)}
          >
            {component.content}
          </div>
        );
      case 'button':
        return (
          <Button 
            variant="outline" 
            className="cursor-pointer"
            onClick={() => onSelect(component.id)}
          >
            {component.content}
          </Button>
        );
      case 'image':
        return (
          <img 
            src={component.content} 
            alt="Component" 
            className="max-w-full h-auto cursor-pointer"
            onClick={() => onSelect(component.id)}
          />
        );
      case 'container':
        return (
          <div 
            className="border-2 border-dashed border-gray-300 p-4 min-h-[100px] cursor-pointer"
            onClick={() => onSelect(component.id)}
          >
            <div className="text-gray-500 text-center">Container</div>
            {component.children?.map((child) => (
              <DraggableComponent
                key={child.id}
                component={child}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onDuplicate={onDuplicate}
                isSelected={false}
                onSelect={onSelect}
              />
            ))}
          </div>
        );
      case 'card':
        return (
          <Card className="cursor-pointer" onClick={() => onSelect(component.id)}>
            <CardContent className="p-4">
              {component.content}
            </CardContent>
          </Card>
        );
      default:
        return <div>Unknown component</div>;
    }
  };

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={cn(
        'relative group',
        isDragging && 'opacity-50',
        isOver && 'bg-blue-50',
        isSelected && 'ring-2 ring-brand-500'
      )}
    >
      {renderComponent()}
      
      {isSelected && (
        <div className="absolute -top-8 left-0 flex gap-1 bg-background border rounded-md p-1 shadow-sm">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDuplicate(component.id)}
            className="h-6 w-6 p-0"
          >
            <Copy className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
          >
            <Settings className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(component.id)}
            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
};

const ComponentPalette: React.FC<{ onAddComponent: (type: string) => void }> = ({ onAddComponent }) => {
  return (
    <Card className="h-full">
      <CardContent className="p-4">
        <h3 className="font-semibold mb-4">Components</h3>
        <div className="space-y-2">
          {componentTypes.map((comp) => {
            const Icon = comp.icon;
            return (
              <Button
                key={comp.type}
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => onAddComponent(comp.type)}
              >
                <Icon className="h-4 w-4" />
                {comp.label}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

const DropZone: React.FC<{
  components: ComponentProps[];
  onUpdate: (id: string, updates: Partial<ComponentProps>) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  selectedComponent: string | null;
  onSelectComponent: (id: string) => void;
}> = ({ components, onUpdate, onDelete, onDuplicate, selectedComponent, onSelectComponent }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'new-component',
    drop: () => ({}),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className={cn(
        'min-h-[500px] border-2 border-dashed border-gray-300 p-4 bg-white',
        isOver && 'border-brand-500 bg-brand-50'
      )}
    >
      {components.length === 0 ? (
        <div className="text-center text-gray-500 py-20">
          <Layout className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Drag components here to start building</p>
        </div>
      ) : (
        <div className="space-y-4">
          {components.map((component) => (
            <DraggableComponent
              key={component.id}
              component={component}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
              isSelected={selectedComponent === component.id}
              onSelect={onSelectComponent}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const PropertiesPanel: React.FC<{
  selectedComponent: ComponentProps | null;
  onUpdate: (updates: Partial<ComponentProps>) => void;
}> = ({ selectedComponent, onUpdate }) => {
  if (!selectedComponent) {
    return (
      <Card className="h-full">
        <CardContent className="p-4">
          <h3 className="font-semibold mb-4">Properties</h3>
          <p className="text-gray-500">Select a component to edit its properties</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardContent className="p-4">
        <h3 className="font-semibold mb-4">Properties</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Content</label>
            <textarea
              className="w-full p-2 border rounded mt-1"
              value={selectedComponent.content}
              onChange={(e) => onUpdate({ content: e.target.value })}
              rows={3}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Type</label>
            <Badge variant="secondary" className="ml-2">
              {selectedComponent.type}
            </Badge>
          </div>

          <div>
            <label className="text-sm font-medium">Styles</label>
            <div className="space-y-2 mt-2">
              <div>
                <label className="text-xs">Color</label>
                <input
                  type="color"
                  className="w-full h-8 border rounded"
                  value={selectedComponent.styles.color || '#000000'}
                  onChange={(e) => onUpdate({ 
                    styles: { ...selectedComponent.styles, color: e.target.value }
                  })}
                />
              </div>
              <div>
                <label className="text-xs">Font Size</label>
                <input
                  type="range"
                  min="12"
                  max="48"
                  className="w-full"
                  value={parseInt(selectedComponent.styles.fontSize) || 16}
                  onChange={(e) => onUpdate({ 
                    styles: { ...selectedComponent.styles, fontSize: `${e.target.value}px` }
                  })}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const VisualEditor: React.FC = () => {
  const [components, setComponents] = useState<ComponentProps[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);

  const addComponent = useCallback((type: string) => {
    const componentType = componentTypes.find(c => c.type === type);
    if (!componentType) return;

    const newComponent: ComponentProps = {
      id: `${type}-${Date.now()}`,
      type: type as any,
      content: componentType.defaultContent,
      styles: {},
      children: []
    };

    setComponents(prev => [...prev, newComponent]);
  }, []);

  const updateComponent = useCallback((id: string, updates: Partial<ComponentProps>) => {
    setComponents(prev => prev.map(comp => 
      comp.id === id ? { ...comp, ...updates } : comp
    ));
  }, []);

  const deleteComponent = useCallback((id: string) => {
    setComponents(prev => prev.filter(comp => comp.id !== id));
    if (selectedComponent === id) {
      setSelectedComponent(null);
    }
  }, [selectedComponent]);

  const duplicateComponent = useCallback((id: string) => {
    const component = components.find(c => c.id === id);
    if (!component) return;

    const newComponent = {
      ...component,
      id: `${component.type}-${Date.now()}`,
    };

    setComponents(prev => [...prev, newComponent]);
  }, [components]);

  const selectedComponentData = components.find(c => c.id === selectedComponent);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen grid grid-cols-12 gap-4 p-4">
        {/* Component Palette */}
        <div className="col-span-2">
          <ComponentPalette onAddComponent={addComponent} />
        </div>

        {/* Canvas */}
        <div className="col-span-7">
          <Card className="h-full">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Canvas</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Desktop</Button>
                  <Button variant="outline" size="sm">Mobile</Button>
                </div>
              </div>
              <DropZone
                components={components}
                onUpdate={updateComponent}
                onDelete={deleteComponent}
                onDuplicate={duplicateComponent}
                selectedComponent={selectedComponent}
                onSelectComponent={setSelectedComponent}
              />
            </CardContent>
          </Card>
        </div>

        {/* Properties Panel */}
        <div className="col-span-3">
          <PropertiesPanel
            selectedComponent={selectedComponentData || null}
            onUpdate={(updates) => {
              if (selectedComponent) {
                updateComponent(selectedComponent, updates);
              }
            }}
          />
        </div>
      </div>
    </DndProvider>
  );
};

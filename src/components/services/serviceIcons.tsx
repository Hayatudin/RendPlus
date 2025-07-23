
import { Building2, Home, Palette, PenTool, TreePine, Briefcase, GraduationCap, Building, Landmark } from "lucide-react";

export const getIconComponent = (iconName: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    'palette': <Palette className="h-5 w-5 text-white" />,
    'building-2': <Building2 className="h-5 w-5 text-white" />,
    'architecture': <Building className="h-5 w-5 text-white" />,
    'tree-pine': <TreePine className="h-5 w-5 text-white" />,
    'landscape': <Landmark className="h-5 w-5 text-white" />,
    'home': <Home className="h-5 w-5 text-white" />,
    'briefcase': <Briefcase className="h-5 w-5 text-white" />,
    'graduation-cap': <GraduationCap className="h-5 w-5 text-white" />,
    'pen-tool': <PenTool className="h-5 w-5 text-white" />
  };
  
  return iconMap[iconName] || <PenTool className="h-5 w-5 text-white" />;
};

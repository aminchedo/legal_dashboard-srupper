// Complete icon registry with all commonly used icons
import { 
  Play, Server, Home, Settings, Users, FileText, BarChart3, Shield, Database,
  Globe, Monitor, Activity, AlertTriangle, CheckCircle, XCircle, RefreshCw,
  Eye, EyeOff, Plus, Minus, Edit, Trash2, Save, Download, Upload, Search,
  Filter, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Menu, X, Bell, User,
  LogOut, Lock, Unlock, Star, Heart, Mail, Phone, Calendar, Clock, MapPin,
  Tag, Bookmark, Share, Copy, ExternalLink, Info, HelpCircle, 
  MoreHorizontal, MoreVertical, FlaskConical, PlayCircle, StopCircle,
  Cloud, HardDrive, Cpu, Wifi, WifiOff, Zap, TestTube, Settings2,
  // Additional missing icons
  BookOpen, Award, TrendingUp, Square, AlertCircle, PlugZap, CloudLightning,
  MemoryStick, RotateCw, Loader2, Octagon
} from 'lucide-react';

// Import chart components from recharts  
import {
  ResponsiveContainer, AreaChart, PieChart, BarChart, Pie, Area, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Cell
} from 'recharts';

export const Icons = {
  Play, Server, Home, Settings, Users, FileText, BarChart3, Shield, Database,
  Globe, Monitor, Activity, AlertTriangle, CheckCircle, XCircle, RefreshCw,
  Eye, EyeOff, Plus, Minus, Edit, Trash2, Save, Download, Upload, Search,
  Filter, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Menu, X, Bell, User,
  LogOut, Lock, Unlock, Star, Heart, Mail, Phone, Calendar, Clock, MapPin,
  Tag, Bookmark, Share, Copy, ExternalLink, Info, HelpCircle, 
  MoreHorizontal, MoreVertical, FlaskConical, PlayCircle, StopCircle,
  Cloud, HardDrive, Cpu, Wifi, WifiOff, Zap, TestTube, Settings2,
  // Additional missing icons
  BookOpen, Award, TrendingUp, Square, AlertCircle, PlugZap, CloudLightning,
  MemoryStick, RotateCw, Loader2, Octagon
};

export default Icons;
export type IconName = keyof typeof Icons;

// Export chart components
export {
  ResponsiveContainer, AreaChart, PieChart, BarChart, Pie, Area, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Cell
};

// Re-export individual icons for direct import if needed
export {
  Play, Server, Home, Settings, Users, FileText, BarChart3, Shield, Database,
  Globe, Monitor, Activity, AlertTriangle, CheckCircle, XCircle, RefreshCw,
  Eye, EyeOff, Plus, Minus, Edit, Trash2, Save, Download, Upload, Search,
  Filter, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Menu, X, Bell, User,
  LogOut, Lock, Unlock, Star, Heart, Mail, Phone, Calendar, Clock, MapPin,
  Tag, Bookmark, Share, Copy, ExternalLink, Info, HelpCircle, 
  MoreHorizontal, MoreVertical, FlaskConical, PlayCircle, StopCircle,
  Cloud, HardDrive, Cpu, Wifi, WifiOff, Zap, TestTube, Settings2,
  // Additional missing icons
  BookOpen, Award, TrendingUp, Square, AlertCircle, PlugZap, CloudLightning,
  MemoryStick, RotateCw, Loader2, Octagon
};
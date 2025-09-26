import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SectionSpeaker } from "@/components/ui/section-speaker";
import { Search, BookOpen, Play, Clock, Users, Star, Download, Video, FileText, Headphones, ArrowLeft, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  rating: number;
  students: number;
  type: 'video' | 'audio' | 'text';
  language: string;
  thumbnail: string;
  progress?: number;
}

const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Modern Crop Disease Management',
    description: 'Learn to identify and treat common crop diseases using traditional and modern methods',
    instructor: 'Dr. Rajesh Kumar',
    duration: '2.5 hours',
    level: 'Beginner',
    category: 'Disease Management',
    rating: 4.8,
    students: 1250,
    type: 'video',
    language: 'Hindi',
    thumbnail: 'disease-course.jpg'
  },
  {
    id: '2',
    title: 'Soil Health and Fertilizer Application',
    description: 'Complete guide to soil testing, nutrient management, and organic farming practices',
    instructor: 'Prof. Sunita Sharma',
    duration: '3 hours',
    level: 'Intermediate',
    category: 'Soil Management',
    rating: 4.9,
    students: 980,
    type: 'video',
    language: 'Hindi',
    thumbnail: 'soil-course.jpg',
    progress: 45
  },
  {
    id: '3',
    title: 'Weather-Based Farming Decisions',
    description: 'How to use weather forecasts and climate data for better farming decisions',
    instructor: 'Dr. Amit Patel',
    duration: '1.5 hours',
    level: 'Beginner',
    category: 'Weather Advisory',
    rating: 4.7,
    students: 2100,
    type: 'audio',
    language: 'English',
    thumbnail: 'weather-course.jpg'
  },
  {
    id: '4',
    title: 'Market Intelligence for Farmers',
    description: 'Understanding market trends, price forecasting, and when to sell your crops',
    instructor: 'CA Priya Singh',
    duration: '2 hours',
    level: 'Advanced',
    category: 'Market Analysis',
    rating: 4.6,
    students: 750,
    type: 'text',
    language: 'Hindi',
    thumbnail: 'market-course.jpg'
  },
  {
    id: '5',
    title: 'Integrated Pest Management',
    description: 'Sustainable pest control methods combining biological, cultural, and chemical approaches',
    instructor: 'Dr. Meena Reddy',
    duration: '4 hours',
    level: 'Intermediate',
    category: 'Pest Control',
    rating: 4.8,
    students: 1100,
    type: 'video',
    language: 'Telugu',
    thumbnail: 'pest-course.jpg'
  },
  {
    id: '6',
    title: 'Organic Farming Certification',
    description: 'Step-by-step guide to converting to organic farming and getting certified',
    instructor: 'Shri Ramesh Joshi',
    duration: '3.5 hours',
    level: 'Advanced',
    category: 'Organic Farming',
    rating: 4.9,
    students: 650,
    type: 'video',
    language: 'Hindi',
    thumbnail: 'organic-course.jpg'
  }
];

const Teaching = () => {
  const navigate = useNavigate();
  const [courses] = useState<Course[]>(mockCourses);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [activeTab, setActiveTab] = useState('all');

  const categories = ['all', 'Disease Management', 'Soil Management', 'Weather Advisory', 'Market Analysis', 'Pest Control', 'Organic Farming'];
  const levels = ['all', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'enrolled' && course.progress !== undefined) ||
                      (activeTab === 'video' && course.type === 'video') ||
                      (activeTab === 'audio' && course.type === 'audio');
    
    return matchesSearch && matchesCategory && matchesLevel && matchesTab;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'audio': return <Headphones className="h-4 w-4" />;
      case 'text': return <FileText className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'success';
      case 'Intermediate': return 'warning';
      case 'Advanced': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">FarmIQ Learning Center</h1>
          </div>
          <p className="text-muted-foreground">
            Expert-led courses and resources for modern farming practices
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Search and Filters */}
        <div className="bg-card border rounded-lg p-6 mb-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courses, instructors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
            
            <select 
              value={selectedLevel} 
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              {levels.map(level => (
                <option key={level} value={level}>
                  {level === 'all' ? 'All Levels' : level}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Courses</TabsTrigger>
            <TabsTrigger value="enrolled">My Courses</TabsTrigger>
            <TabsTrigger value="video">Video</TabsTrigger>
            <TabsTrigger value="audio">Audio</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-6">
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                {filteredCourses.length} courses available
              </p>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Download Offline
              </Button>
            </div>

            {/* Courses Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.map((course) => {
                const getText = () => `${course.title}. ${course.description}. 
                  Instructor: ${course.instructor}. 
                  Duration: ${course.duration}. 
                  Level: ${course.level}. 
                  ${course.students} students enrolled.`;
                
                return (
                  <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                    <div className="aspect-video bg-muted relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        {getTypeIcon(course.type)}
                      </div>
                      <div className="absolute top-2 left-2">
                        <Badge variant={getLevelColor(course.level) as any}>
                          {course.level}
                        </Badge>
                      </div>
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="gap-1">
                          {getTypeIcon(course.type)}
                          {course.type}
                        </Badge>
                      </div>
                      {course.progress && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
                          <div className="bg-primary h-1 rounded-full" style={{ width: `${course.progress}%` }} />
                          <p className="text-white text-xs mt-1">{course.progress}% complete</p>
                        </div>
                      )}
                    </div>
                    
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle 
                            className="text-lg leading-tight"
                            data-tts="title"
                          >
                            {course.title}
                          </CardTitle>
                          <div 
                            className="text-sm text-muted-foreground"
                            data-tts="instructor"
                          >
                            <span>{course.instructor}</span>
                          </div>
                        </div>
                        <SectionSpeaker 
                          getText={getText}
                          sectionId={`course-${course.id}`}
                          ariaLabel={`Read ${course.title} course details`}
                          alwaysVisible
                        />
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <CardDescription 
                        data-tts="desc"
                      >
                        {course.description}
                      </CardDescription>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{course.duration}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{course.students} students</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-primary text-primary" />
                            <span className="text-sm font-medium">{course.rating}</span>
                          </div>
                          <Badge variant="outline">{course.language}</Badge>
                        </div>
                        
                        <Button size="sm" className="gap-2">
                          <Play className="h-4 w-4" />
                          {course.progress ? 'Continue' : 'Start'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredCourses.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No courses found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Teaching;
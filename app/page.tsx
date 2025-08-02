'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  Calculator, 
  Plus, 
  Trash2, 
  Download, 
  BookOpen, 
  TrendingUp, 
  Award,
  FileText,
  BarChart3,
  Target,
  GraduationCap,
  Code,
  Cpu,
  Zap
} from 'lucide-react';
import jsPDF from 'jspdf';

interface Subject {
  id: string;
  name: string;
  credits: number;
  grade: string;
  gradePoints: number;
}

interface Semester {
  id: string;
  name: string;
  subjects: Subject[];
  sgpa: number;
}

interface CGPASemester {
  id: string;
  name: string;
  sgpa: number;
  credits: number;
}

interface SGPACalculatorState {
  selectedBranch: keyof typeof branchSubjects;
  selectedSemester: number;
  subjects: Subject[];
}

const gradeScale = {
  'A+': 10,
  'A': 9,
  'B+': 8,
  'B': 7,
  'C+': 6,
  'C': 5,
  'D': 4,
  'F': 0
};

const branches = {
  'CSE': 'Computer Science Engineering',
  'CSSE': 'Computer Science & Systems Engineering',
  'CSCE': 'Computer Science & Computer Engineering',
  'IT': 'Information Technology',
};

const branchSubjects = {
  'CSE': {
    1: [
      { name: 'Mathematics I', credits: 4 },
      { name: 'Physics', credits: 4 },
      { name: 'Chemistry', credits: 3 },
      { name: 'Programming in C', credits: 4 },
      { name: 'Engineering Graphics', credits: 3 },
      { name: 'English Communication', credits: 2 }
    ],
    2: [
      { name: 'Mathematics II', credits: 4 },
      { name: 'Data Structures', credits: 4 },
      { name: 'Digital Logic Design', credits: 3 },
      { name: 'Object Oriented Programming', credits: 4 },
      { name: 'Environmental Science', credits: 2 },
      { name: 'Workshop Practice', credits: 3 }
    ],
    3: [
      { name: 'Mathematics III', credits: 4 },
      { name: 'Database Management Systems', credits: 4 },
      { name: 'Computer Organization', credits: 3 },
      { name: 'Operating Systems', credits: 4 },
      { name: 'Software Engineering', credits: 3 },
      { name: 'Web Technologies', credits: 2 }
    ],
    4: [
      { name: 'Analysis of Algorithms', credits: 4 },
      { name: 'Computer Networks', credits: 4 },
      { name: 'Theory of Computation', credits: 3 },
      { name: 'Microprocessors', credits: 3 },
      { name: 'Java Programming', credits: 3 },
      { name: 'Technical Communication', credits: 3 }
    ],
    5: [
      { name: 'Machine Learning', credits: 4 },
      { name: 'Compiler Design', credits: 4 },
      { name: 'Computer Graphics', credits: 3 },
      { name: 'Information Security', credits: 3 },
      { name: 'Elective I', credits: 3 },
      { name: 'Mini Project', credits: 3 }
    ],
    6: [
      { name: 'Artificial Intelligence', credits: 4 },
      { name: 'Mobile Computing', credits: 3 },
      { name: 'Cloud Computing', credits: 3 },
      { name: 'Data Mining', credits: 3 },
      { name: 'Elective II', credits: 3 },
      { name: 'Seminar', credits: 4 }
    ],
    7: [
      { name: 'Big Data Analytics', credits: 4 },
      { name: 'Internet of Things', credits: 3 },
      { name: 'Blockchain Technology', credits: 3 },
      { name: 'Elective III', credits: 3 },
      { name: 'Elective IV', credits: 3 },
      { name: 'Major Project I', credits: 4 }
    ],
    8: [
      { name: 'Industry Internship', credits: 6 },
      { name: 'Major Project II', credits: 8 },
      { name: 'Professional Ethics', credits: 2 },
      { name: 'Entrepreneurship', credits: 2 },
      { name: 'Comprehensive Viva', credits: 2 }
    ]
  },
  'CSSE': {
    1: [
      { name: 'Mathematics I', credits: 4 },
      { name: 'Physics', credits: 4 },
      { name: 'Chemistry', credits: 3 },
      { name: 'Basic Electronics', credits: 4 },
      { name: 'Engineering Graphics', credits: 3 },
      { name: 'English Communication', credits: 2 }
    ],
    2: [
      { name: 'Mathematics II', credits: 4 },
      { name: 'Circuit Analysis', credits: 4 },
      { name: 'Electronic Devices', credits: 4 },
      { name: 'Programming in C', credits: 3 },
      { name: 'Environmental Science', credits: 2 },
      { name: 'Workshop Practice', credits: 3 }
    ],
    3: [
      { name: 'Mathematics III', credits: 4 },
      { name: 'Analog Electronics', credits: 4 },
      { name: 'Digital Electronics', credits: 4 },
      { name: 'Signals & Systems', credits: 3 },
      { name: 'Network Theory', credits: 3 },
      { name: 'Electromagnetic Theory', credits: 2 }
    ],
    4: [
      { name: 'Microprocessors', credits: 4 },
      { name: 'Communication Systems', credits: 4 },
      { name: 'Control Systems', credits: 3 },
      { name: 'VLSI Design', credits: 3 },
      { name: 'Antenna Theory', credits: 3 },
      { name: 'Technical Communication', credits: 3 }
    ],
    5: [
      { name: 'Digital Signal Processing', credits: 4 },
      { name: 'Microwave Engineering', credits: 4 },
      { name: 'Embedded Systems', credits: 3 },
      { name: 'Optical Communication', credits: 3 },
      { name: 'Elective I', credits: 3 },
      { name: 'Mini Project', credits: 3 }
    ],
    6: [
      { name: 'Wireless Communication', credits: 4 },
      { name: 'Digital Image Processing', credits: 3 },
      { name: 'Satellite Communication', credits: 3 },
      { name: 'Power Electronics', credits: 3 },
      { name: 'Elective II', credits: 3 },
      { name: 'Seminar', credits: 4 }
    ],
    7: [
      { name: 'Mobile Communication', credits: 4 },
      { name: 'Radar Systems', credits: 3 },
      { name: 'Biomedical Electronics', credits: 3 },
      { name: 'Elective III', credits: 3 },
      { name: 'Elective IV', credits: 3 },
      { name: 'Major Project I', credits: 4 }
    ],
    8: [
      { name: 'Industry Internship', credits: 6 },
      { name: 'Major Project II', credits: 8 },
      { name: 'Professional Ethics', credits: 2 },
      { name: 'Entrepreneurship', credits: 2 },
      { name: 'Comprehensive Viva', credits: 2 }
    ]
  },
  'CSCE': {
    1: [
      { name: 'Mathematics I', credits: 4 },
      { name: 'Physics', credits: 4 },
      { name: 'Chemistry', credits: 3 },
      { name: 'Engineering Mechanics', credits: 4 },
      { name: 'Engineering Graphics', credits: 3 },
      { name: 'English Communication', credits: 2 }
    ],
    2: [
      { name: 'Mathematics II', credits: 4 },
      { name: 'Strength of Materials', credits: 4 },
      { name: 'Thermodynamics', credits: 4 },
      { name: 'Manufacturing Processes', credits: 3 },
      { name: 'Environmental Science', credits: 2 },
      { name: 'Workshop Practice', credits: 3 }
    ],
    3: [
      { name: 'Mathematics III', credits: 4 },
      { name: 'Fluid Mechanics', credits: 4 },
      { name: 'Material Science', credits: 3 },
      { name: 'Machine Design I', credits: 4 },
      { name: 'Heat Transfer', credits: 3 },
      { name: 'Kinematics of Machines', credits: 2 }
    ],
    4: [
      { name: 'Dynamics of Machines', credits: 4 },
      { name: 'IC Engines', credits: 4 },
      { name: 'Machine Design II', credits: 3 },
      { name: 'Manufacturing Technology', credits: 3 },
      { name: 'Metrology', credits: 3 },
      { name: 'Technical Communication', credits: 3 }
    ],
    5: [
      { name: 'Automobile Engineering', credits: 4 },
      { name: 'Power Plant Engineering', credits: 4 },
      { name: 'Industrial Engineering', credits: 3 },
      { name: 'Refrigeration & AC', credits: 3 },
      { name: 'Elective I', credits: 3 },
      { name: 'Mini Project', credits: 3 }
    ],
    6: [
      { name: 'Robotics & Automation', credits: 4 },
      { name: 'Finite Element Analysis', credits: 3 },
      { name: 'Operations Research', credits: 3 },
      { name: 'Quality Control', credits: 3 },
      { name: 'Elective II', credits: 3 },
      { name: 'Seminar', credits: 4 }
    ],
    7: [
      { name: 'Advanced Manufacturing', credits: 4 },
      { name: 'Renewable Energy', credits: 3 },
      { name: 'Project Management', credits: 3 },
      { name: 'Elective III', credits: 3 },
      { name: 'Elective IV', credits: 3 },
      { name: 'Major Project I', credits: 4 }
    ],
    8: [
      { name: 'Industry Internship', credits: 6 },
      { name: 'Major Project II', credits: 8 },
      { name: 'Professional Ethics', credits: 2 },
      { name: 'Entrepreneurship', credits: 2 },
      { name: 'Comprehensive Viva', credits: 2 }
    ]
  },
  'IT': {
    1: [
      { name: 'Mathematics I', credits: 4 },
      { name: 'Physics', credits: 4 },
      { name: 'Chemistry', credits: 3 },
      { name: 'Basic Electronics', credits: 4 },
      { name: 'Engineering Graphics', credits: 3 },
      { name: 'English Communication', credits: 2 }
    ],
    2: [
      { name: 'Mathematics II', credits: 4 },
      { name: 'Data Structures', credits: 4 },
      { name: 'Computer Organization', credits: 4 },
      { name: 'Operating Systems', credits: 3 },
      { name: 'Database Management Systems', credits: 3 },
    ],
    3: [
      { name: 'Mathematics III', credits: 4 },
      { name: 'Computer Networks', credits: 4 },
      { name: 'Compiler Design', credits: 3 },
      { name: 'Artificial Intelligence', credits: 3 },
      { name: 'Software Engineering', credits: 3 },
    ],
    4: [
      { name: 'Data Structures', credits: 4 },
      { name: 'Computer Organization', credits: 4 },
      { name: 'Operating Systems', credits: 3 },
      { name: 'Database Management Systems', credits: 3 },
    ],
    5: [
      { name: 'Data Structures', credits: 4 },
      { name: 'Computer Organization', credits: 4 },
      { name: 'Operating Systems', credits: 3 },
      { name: 'Database Management Systems', credits: 3 },
    ],
    6: [
      { name: 'Data Structures', credits: 4 },
      { name: 'Computer Organization', credits: 4 },
      { name: 'Operating Systems', credits: 3 },
      { name: 'Database Management Systems', credits: 3 },
    ],
    7: [
      { name: 'Data Structures', credits: 4 },
      { name: 'Computer Organization', credits: 4 },
      { name: 'Operating Systems', credits: 3 },
      { name: 'Database Management Systems', credits: 3 },
    ],
    8: [
      { name: 'Industry Internship', credits: 6 },
      { name: 'Major Project II', credits: 8 },
      { name: 'Professional Ethics', credits: 2 },
      { name: 'Entrepreneurship', credits: 2 },
      { name: 'Comprehensive Viva', credits: 2 }
    ]
  }
};

export default function AdvancedCGPACalculator() {
  // Move all useState hooks to the top
  // SGPA Calculator State
  const [sgpaCalculatorState, setSgpaCalculatorState] = useState<SGPACalculatorState>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sgpaCalculatorState');
      if (saved) return JSON.parse(saved);
    }
    return {
      selectedBranch: 'CSE',
      selectedSemester: 1,
      subjects: []
    };
  });
  const [sgpaResult, setSgpaResult] = useState(0);

  // CGPA Calculator State
  const [cgpaSemesters, setCgpaSemesters] = useState<CGPASemester[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cgpaSemesters');
      if (saved) return JSON.parse(saved);
    }
    return [];
  });
  const [cgpaResult, setCgpaResult] = useState(0);

  // Aggregate Calculator State
  const [selectedBranch, setSelectedBranch] = useState<keyof typeof branchSubjects>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('selectedBranch');
      if (saved) return saved as keyof typeof branchSubjects;
    }
    return 'CSE';
  });
  const [aggregateSemesters, setAggregateSemesters] = useState<Semester[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aggregateSemesters');
      if (saved) return JSON.parse(saved);
    }
    return [];
  });
  const [aggregateCgpa, setAggregateCgpa] = useState(0);
  const [totalCredits, setTotalCredits] = useState(0);
  const [aggregateFromSemester, setAggregateFromSemester] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aggregateFromSemester');
      if (saved) return parseInt(saved);
    }
    return 1;
  });
  const [aggregateToSemester, setAggregateToSemester] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aggregateToSemester');
      if (saved) return parseInt(saved);
    }
    return 8;
  });

  // Persist SGPA Calculator State
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sgpaCalculatorState', JSON.stringify(sgpaCalculatorState));
    }
  }, [sgpaCalculatorState]);

  // Persist CGPA Semesters
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cgpaSemesters', JSON.stringify(cgpaSemesters));
    }
  }, [cgpaSemesters]);

  // Persist Aggregate Calculator State
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedBranch', selectedBranch);
      localStorage.setItem('aggregateSemesters', JSON.stringify(aggregateSemesters));
      localStorage.setItem('aggregateFromSemester', aggregateFromSemester.toString());
      localStorage.setItem('aggregateToSemester', aggregateToSemester.toString());
    }
  }, [selectedBranch, aggregateSemesters, aggregateFromSemester, aggregateToSemester]);

  // Initialize SGPA calculator subjects based on branch and semester
  useEffect(() => {
    const semesterSubjects = branchSubjects[sgpaCalculatorState.selectedBranch][sgpaCalculatorState.selectedSemester as keyof typeof branchSubjects[typeof sgpaCalculatorState.selectedBranch]];
    
    if (semesterSubjects) {
      const initializedSubjects = semesterSubjects.map((subject, index) => ({
        id: `${sgpaCalculatorState.selectedSemester}-${index}`,
        name: subject.name,
        credits: subject.credits,
        grade: 'A',
        gradePoints: 9
      }));
      
      setSgpaCalculatorState(prev => ({
        ...prev,
        subjects: initializedSubjects
      }));
    }
  }, [sgpaCalculatorState.selectedBranch, sgpaCalculatorState.selectedSemester]);

  // Initialize aggregate semesters based on branch
  useEffect(() => {
    const initSemesters = Array.from({ length: 8 }, (_, index) => {
      const semesterNum = index + 1;
      const subjects = branchSubjects[selectedBranch][semesterNum as keyof typeof branchSubjects[typeof selectedBranch]];
      
      return {
        id: semesterNum.toString(),
        name: `Semester ${semesterNum}`,
        subjects: subjects.map((subject, subIndex) => ({
          id: `${semesterNum}-${subIndex}`,
          name: subject.name,
          credits: subject.credits,
          grade: 'A',
          gradePoints: 9
        })),
        sgpa: 0
      };
    });
    
    setAggregateSemesters(initSemesters);
  }, [selectedBranch]);

  // SGPA Calculator Functions
  const updateSgpaBranch = (branch: keyof typeof branchSubjects) => {
    setSgpaCalculatorState(prev => ({
      ...prev,
      selectedBranch: branch,
      selectedSemester: 1
    }));
  };

  const updateSgpaSemester = (semester: number) => {
    setSgpaCalculatorState(prev => ({
      ...prev,
      selectedSemester: semester
    }));
  };

  const updateSgpaSubject = (subjectId: string, field: keyof Subject, value: any) => {
    setSgpaCalculatorState(prev => ({
      ...prev,
      subjects: prev.subjects.map(sub => 
        sub.id === subjectId 
          ? { 
              ...sub, 
              [field]: value,
              ...(field === 'grade' ? { gradePoints: gradeScale[value as keyof typeof gradeScale] } : {})
            }
          : sub
      )
    }));
  };

  const calculateSGPA = (subjects: Subject[]) => {
    if (subjects.length === 0) return 0;
    
    const totalPoints = subjects.reduce((sum, subject) => 
      sum + (subject.gradePoints * subject.credits), 0
    );
    const totalCredits = subjects.reduce((sum, subject) => sum + subject.credits, 0);
    
    return totalCredits > 0 ? totalPoints / totalCredits : 0;
  };

  // CGPA Calculator Functions
  const addCgpaSemester = () => {
    const newSemester: CGPASemester = {
      id: Date.now().toString(),
      name: `Semester ${cgpaSemesters.length + 1}`,
      sgpa: 0,
      credits: 20
    };
    setCgpaSemesters([...cgpaSemesters, newSemester]);
  };

  const deleteCgpaSemester = (semesterId: string) => {
    if (cgpaSemesters.length > 1) {
      setCgpaSemesters(cgpaSemesters.filter(sem => sem.id !== semesterId));
    }
  };

  const updateCgpaSemester = (semesterId: string, field: keyof CGPASemester, value: any) => {
    setCgpaSemesters(cgpaSemesters.map(sem => 
      sem.id === semesterId ? { ...sem, [field]: value } : sem
    ));
  };

  const calculateCGPAFromSGPA = () => {
    if (cgpaSemesters.length === 0) return 0;
    
    const totalPoints = cgpaSemesters.reduce((sum, sem) => sum + (sem.sgpa * sem.credits), 0);
    const totalCreds = cgpaSemesters.reduce((sum, sem) => sum + sem.credits, 0);
    
    return totalCreds > 0 ? totalPoints / totalCreds : 0;
  };

  // Aggregate Calculator Functions
  const updateAggregateSubject = (semesterId: string, subjectId: string, grade: string) => {
    setAggregateSemesters(semesters => 
      semesters.map(sem => 
        sem.id === semesterId 
          ? {
              ...sem,
              subjects: sem.subjects.map(sub => 
                sub.id === subjectId 
                  ? { ...sub, grade, gradePoints: gradeScale[grade as keyof typeof gradeScale] }
                  : sub
              )
            }
          : sem
      )
    );
  };

  const calculateAggregateCGPA = () => {
    let totalPoints = 0;
    let totalCreds = 0;
    
    const filteredSemesters = aggregateSemesters.filter((semester, index) => {
      const semesterNumber = index + 1;
      return semesterNumber >= aggregateFromSemester && semesterNumber <= aggregateToSemester;
    });
    
    filteredSemesters.forEach(semester => {
      semester.subjects.forEach(subject => {
        totalPoints += subject.gradePoints * subject.credits;
        totalCreds += subject.credits;
      });
    });
    
    return totalCreds > 0 ? totalPoints / totalCreds : 0;
  };

  // Update calculations
  useEffect(() => {
    setSgpaResult(calculateSGPA(sgpaCalculatorState.subjects));
  }, [sgpaCalculatorState.subjects]);

  useEffect(() => {
    setCgpaResult(calculateCGPAFromSGPA());
  }, [cgpaSemesters]);

  useEffect(() => {
    const updatedSemesters = aggregateSemesters.map(sem => ({
      ...sem,
      sgpa: calculateSGPA(sem.subjects)
    }));
    setAggregateSemesters(updatedSemesters);
    
    const newCgpa = calculateAggregateCGPA();
    setAggregateCgpa(newCgpa);
    
    const filteredSemesters = aggregateSemesters.filter((semester, index) => {
      const semesterNumber = index + 1;
      return semesterNumber >= aggregateFromSemester && semesterNumber <= aggregateToSemester;
    });
    
    const newTotalCredits = filteredSemesters.reduce((sum, sem) => 
      sum + sem.subjects.reduce((subSum, sub) => subSum + sub.credits, 0), 0
    );
    setTotalCredits(newTotalCredits);
  }, [aggregateSemesters, aggregateFromSemester, aggregateToSemester]);

  const getGradeColor = (grade: string) => {
    const colors = {
      'A+': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      'A': 'bg-green-500/20 text-green-400 border-green-500/30',
      'B+': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'B': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      'C+': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'C': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      'D': 'bg-red-500/20 text-red-400 border-red-500/30',
      'F': 'bg-red-600/20 text-red-300 border-red-600/30'
    };
    return colors[grade as keyof typeof colors] || colors['A'];
  };

  const getCGPAStatus = (cgpa: number) => {
    if (cgpa >= 9) return { status: 'Excellent', color: 'text-emerald-400', bgColor: 'bg-emerald-500/10' };
    if (cgpa >= 8) return { status: 'Very Good', color: 'text-green-400', bgColor: 'bg-green-500/10' };
    if (cgpa >= 7) return { status: 'Good', color: 'text-blue-400', bgColor: 'bg-blue-500/10' };
    if (cgpa >= 6) return { status: 'Average', color: 'text-yellow-400', bgColor: 'bg-yellow-500/10' };
    if (cgpa >= 5) return { status: 'Below Average', color: 'text-orange-400', bgColor: 'bg-orange-500/10' };
    return { status: 'Poor', color: 'text-red-400', bgColor: 'bg-red-500/10' };
  };

  const generatePDF = (type: 'sgpa' | 'cgpa' | 'aggregate', data: any) => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Set dark background
    pdf.setFillColor(15, 15, 15);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');
    
    let yPosition = 25;
    
    // Header
    pdf.setFillColor(26, 26, 26);
    pdf.roundedRect(15, 15, pageWidth - 30, 35, 8, 8, 'F');
    pdf.setDrawColor(59, 130, 246);
    pdf.setLineWidth(0.5);
    pdf.roundedRect(15, 15, pageWidth - 30, 35, 8, 8, 'S');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    
    const titles = {
      sgpa: 'Kalinga Institute of Industrial Technology',
      cgpa: 'Kalinga Institute of Industrial Technology',
      aggregate: 'Kalinga Institute of Industrial Technology'
    };
    
    //make this text in green color
    pdf.setTextColor(16, 185, 129);
    pdf.text(titles[type], pageWidth / 2, 30, { align: 'center' });
    
    pdf.setTextColor(161, 161, 170);
    pdf.setFontSize(12);
    pdf.text(`Powered by KIIT-CONNECT`, pageWidth / 2, 40, { align: 'center' });

    // --- Student Details Section ---
    yPosition = yPosition + 20; // Add more space after header
    const studentBoxHeight = 38;
    pdf.setFillColor(34, 34, 34);
    pdf.roundedRect(20, yPosition, pageWidth - 40, studentBoxHeight, 6, 6, 'F');
    pdf.setDrawColor(59, 130, 246);
    pdf.setLineWidth(0.3);
    pdf.roundedRect(20, yPosition, pageWidth - 40, studentBoxHeight, 6, 6, 'S');

    // Hardcoded student details
    const studentDetails = {
      name: 'Ranjit Kumar',
      roll: 'KIIT22CSE1234',
      branch: 'Computer Science Engineering',
      semester: type === 'sgpa' ? data.semester : (type === 'aggregate' ? `${data.fromSemester} - ${data.toSemester}` : 'All'),
      email: 'ranjit.kumar@kiit.ac.in',
    };

    pdf.setFontSize(13);
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Student Details', 25, yPosition + 9);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);
    pdf.setTextColor(200, 200, 200);
    // Row 1: Name | Roll No
    const leftLabelX = 25;
    const leftValueX = 40;
    const rightLabelX = 110;
    const rightValueX = 130;
    pdf.text('Name:', leftLabelX, yPosition + 18);
    pdf.text('Roll No:', rightLabelX, yPosition + 18);
    pdf.setTextColor(59, 130, 246);
    pdf.text(studentDetails.name, leftValueX, yPosition + 18);
    pdf.text(studentDetails.roll, rightValueX, yPosition + 18);
    pdf.setTextColor(200, 200, 200);
    // Row 2: Branch | Semester
    pdf.text('Branch:', leftLabelX, yPosition + 26);
    pdf.text('Semester:', rightLabelX, yPosition + 26);
    pdf.setTextColor(59, 130, 246);
    pdf.text(studentDetails.branch, leftValueX, yPosition + 26);
    pdf.text(String(studentDetails.semester), rightValueX, yPosition + 26);
    pdf.setTextColor(200, 200, 200);
    // Row 3: Email (spans width)
    pdf.text('Email:', leftLabelX, yPosition + 34);
    pdf.setTextColor(59, 130, 246);
    pdf.text(studentDetails.email, leftValueX, yPosition + 34);

    yPosition = yPosition + studentBoxHeight + 10;
    
    // Content based on type
    if (type === 'sgpa') {
      // SGPA Summary (styled like Aggregate)
      pdf.setFillColor(26, 26, 26);
      pdf.roundedRect(15, yPosition, pageWidth - 30, 40, 6, 6, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(16);
      pdf.text(`Overall SGPA`, 25, yPosition + 15);
      pdf.setFontSize(24);
      pdf.setTextColor(59, 130, 246);
      pdf.text(sgpaResult.toFixed(2), 25, yPosition + 25);
      const sgpaStatus = getCGPAStatus(sgpaResult);
      pdf.setFontSize(12);
      // Set status color
      let statusColor = [161, 161, 170];
      if (sgpaStatus.color === 'text-emerald-400') statusColor = [16, 185, 129];
      else if (sgpaStatus.color === 'text-green-400') statusColor = [34, 197, 94];
      else if (sgpaStatus.color === 'text-blue-400') statusColor = [59, 130, 246];
      else if (sgpaStatus.color === 'text-yellow-400') statusColor = [245, 158, 11];
      else if (sgpaStatus.color === 'text-orange-400') statusColor = [249, 115, 22];
      else if (sgpaStatus.color === 'text-red-400') statusColor = [239, 68, 68];
      pdf.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
      // Draw 'Status:' in gray, then value in color
      pdf.setFontSize(12);
      pdf.setTextColor(161, 161, 170);
      const statusLabel = 'Status:';
      const statusValue = sgpaStatus.status;
      const statusX = pageWidth - 80;
      const statusY = yPosition + 15;
      pdf.text(statusLabel, statusX, statusY, { baseline: 'top' });
      // Measure label width for offset
      const labelWidth = pdf.getTextWidth(statusLabel + ' ');
      pdf.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
      pdf.text(statusValue, statusX + labelWidth, statusY, { baseline: 'top' });
      pdf.setTextColor(161, 161, 170);
      pdf.text(`Total Credits: ${sgpaCalculatorState.subjects.reduce((sum, sub) => sum + sub.credits, 0)}`, statusX, yPosition + 25);
      pdf.text(`Branch: ${sgpaCalculatorState.selectedBranch}`, statusX, yPosition + 35);
      pdf.text(`Semester: ${sgpaCalculatorState.selectedSemester}`, 25, yPosition + 35);
      yPosition += 55;

      // Semester Details (styled like Aggregate, but only one semester)
      const semesterHeight = Math.max(45, sgpaCalculatorState.subjects.length * 8 + 35);
      pdf.setFillColor(26, 26, 26);
      pdf.roundedRect(15, yPosition, pageWidth - 30, semesterHeight, 4, 4, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(14);
      pdf.text(`Semester ${sgpaCalculatorState.selectedSemester}`, 25, yPosition + 12);
      pdf.setTextColor(59, 130, 246);
      pdf.setFontSize(16);
      pdf.text(`SGPA: ${sgpaResult.toFixed(2)}`, pageWidth - 60, yPosition + 12);
      if (sgpaCalculatorState.subjects.length > 0) {
        pdf.setTextColor(161, 161, 170);
        pdf.setFontSize(10);
        pdf.text('Subject', 25, yPosition + 25);
        pdf.text('Credits', pageWidth - 120, yPosition + 25);
        pdf.text('Grade', pageWidth - 80, yPosition + 25);
        pdf.text('Points', pageWidth - 40, yPosition + 25);
        // Draw border line below headings
        pdf.setDrawColor(80, 80, 80);
        pdf.setLineWidth(0.5);
        pdf.line(25, yPosition + 27, pageWidth - 25, yPosition + 27);
        sgpaCalculatorState.subjects.forEach((subject, subIndex) => {
          const subjectY = yPosition + 35 + (subIndex * 8);
          pdf.setTextColor(255, 255, 255);
          pdf.text(subject.name, 25, subjectY);
          pdf.setTextColor(161, 161, 170);
          pdf.text(subject.credits.toString(), pageWidth - 115, subjectY);
          const gradeColors = {
            'A+': [16, 185, 129], 'A': [34, 197, 94], 'B+': [59, 130, 246],
            'B': [6, 182, 212], 'C+': [245, 158, 11], 'C': [249, 115, 22],
            'D': [239, 68, 68], 'F': [220, 38, 38]
          };
          const gradeColor = gradeColors[subject.grade as keyof typeof gradeColors] || [255, 255, 255];
          pdf.setTextColor(gradeColor[0], gradeColor[1], gradeColor[2]);
          pdf.text(subject.grade, pageWidth - 75, subjectY);
          pdf.setTextColor(161, 161, 170);
          pdf.text(subject.gradePoints.toString(), pageWidth - 35, subjectY);
        });
      }
      yPosition += semesterHeight + 10;
    } else if (type === 'cgpa') {
      // CGPA Summary
      pdf.setFillColor(26, 26, 26);
      pdf.roundedRect(15, yPosition, pageWidth - 30, 30, 6, 6, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(16);
      pdf.text('Overall CGPA', 25, yPosition + 15);
      
      pdf.setFontSize(24);
      pdf.setTextColor(59, 130, 246);
      pdf.text(cgpaResult.toFixed(2), 25, yPosition + 25);
      
      const cgpaStatus = getCGPAStatus(cgpaResult);
      pdf.setFontSize(12);
      // Set status color
      let statusColor = [161, 161, 170];
      if (cgpaStatus.color === 'text-emerald-400') statusColor = [16, 185, 129];
      else if (cgpaStatus.color === 'text-green-400') statusColor = [34, 197, 94];
      else if (cgpaStatus.color === 'text-blue-400') statusColor = [59, 130, 246];
      else if (cgpaStatus.color === 'text-yellow-400') statusColor = [245, 158, 11];
      else if (cgpaStatus.color === 'text-orange-400') statusColor = [249, 115, 22];
      else if (cgpaStatus.color === 'text-red-400') statusColor = [239, 68, 68];
      pdf.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
      // Draw 'Status:' in gray, then value in color
      pdf.setFontSize(12);
      pdf.setTextColor(161, 161, 170);
      const cgpaStatusLabel = 'Status:';
      const cgpaStatusValue = cgpaStatus.status;
      const cgpaStatusX = pageWidth - 80;
      const cgpaStatusY = yPosition + 20;
      pdf.text(cgpaStatusLabel, cgpaStatusX, cgpaStatusY, { baseline: 'top' });
      const cgpaLabelWidth = pdf.getTextWidth(cgpaStatusLabel + ' ');
      pdf.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
      pdf.text(cgpaStatusValue, cgpaStatusX + cgpaLabelWidth, cgpaStatusY, { baseline: 'top' });
      pdf.setTextColor(161, 161, 170);
      
      yPosition += 45;
      
      // Semesters
      if (cgpaSemesters.length > 0) {
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(16);
        pdf.text('Semester-wise SGPA', 25, yPosition);
        yPosition += 15;
        
        cgpaSemesters.forEach((semester) => {
          if (yPosition > pageHeight - 40) {
            pdf.addPage();
            pdf.setFillColor(15, 15, 15);
            pdf.rect(0, 0, pageWidth, pageHeight, 'F');
            yPosition = 25;
          }
          
          pdf.setFillColor(26, 26, 26);
          pdf.roundedRect(15, yPosition, pageWidth - 30, 20, 4, 4, 'F');
          
          pdf.setTextColor(255, 255, 255);
          pdf.setFontSize(12);
          pdf.text(semester.name, 25, yPosition + 8);
          pdf.text(`Credits: ${semester.credits}`, 25, yPosition + 15);
          
          pdf.setTextColor(59, 130, 246);
          pdf.text(`SGPA: ${semester.sgpa.toFixed(2)}`, pageWidth - 80, yPosition + 12);
          
          yPosition += 25;
        });
      }
    } else if (type === 'aggregate') {
      // Aggregate Summary
      pdf.setFillColor(26, 26, 26);
      pdf.roundedRect(15, yPosition, pageWidth - 30, 40, 6, 6, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(16);
      pdf.text(`Overall CGPA`, 25, yPosition + 15);
      
      pdf.setFontSize(24);
      pdf.setTextColor(59, 130, 246);
      pdf.text(aggregateCgpa.toFixed(2), 25, yPosition + 25);
      
      const aggStatus = getCGPAStatus(aggregateCgpa);
      pdf.setFontSize(12);
      // Set status color
      let statusColor = [161, 161, 170];
      if (aggStatus.color === 'text-emerald-400') statusColor = [16, 185, 129];
      else if (aggStatus.color === 'text-green-400') statusColor = [34, 197, 94];
      else if (aggStatus.color === 'text-blue-400') statusColor = [59, 130, 246];
      else if (aggStatus.color === 'text-yellow-400') statusColor = [245, 158, 11];
      else if (aggStatus.color === 'text-orange-400') statusColor = [249, 115, 22];
      else if (aggStatus.color === 'text-red-400') statusColor = [239, 68, 68];
      pdf.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
      // Draw 'Status:' in gray, then value in color
      pdf.setFontSize(12);
      pdf.setTextColor(161, 161, 170);
      const aggStatusLabel = 'Status:';
      const aggStatusValue = aggStatus.status;
      const aggStatusX = pageWidth - 80;
      const aggStatusY = yPosition + 15;
      pdf.text(aggStatusLabel, aggStatusX, aggStatusY, { baseline: 'top' });
      const aggLabelWidth = pdf.getTextWidth(aggStatusLabel + ' ');
      pdf.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
      pdf.text(aggStatusValue, aggStatusX + aggLabelWidth, aggStatusY, { baseline: 'top' });
      pdf.setTextColor(161, 161, 170);
      pdf.text(`Total Credits: ${totalCredits}`, aggStatusX, yPosition + 25);
      pdf.text(`Branch: ${selectedBranch}`, aggStatusX, yPosition + 35);
      pdf.text(`Semesters: ${aggregateFromSemester} to ${aggregateToSemester}`, 25, yPosition + 35);
      
      yPosition += 55;
      
      // Semester Details
      const filteredSemesters = aggregateSemesters.filter((semester, index) => {
        const semesterNumber = index + 1;
        return semesterNumber >= aggregateFromSemester && semesterNumber <= aggregateToSemester;
      });
      
      filteredSemesters.forEach((semester) => {
        if (yPosition > pageHeight - 60) {
          pdf.addPage();
          pdf.setFillColor(15, 15, 15);
          pdf.rect(0, 0, pageWidth, pageHeight, 'F');
          yPosition = 25;
        }
        
        const semesterHeight = Math.max(45, semester.subjects.length * 8 + 35);
        
        pdf.setFillColor(26, 26, 26);
        pdf.roundedRect(15, yPosition, pageWidth - 30, semesterHeight, 4, 4, 'F');
        
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(14);
        pdf.text(semester.name, 25, yPosition + 12);
        
        pdf.setTextColor(59, 130, 246);
        pdf.setFontSize(16);
        pdf.text(`SGPA: ${semester.sgpa.toFixed(2)}`, pageWidth - 60, yPosition + 12);
        
        if (semester.subjects.length > 0) {
          pdf.setTextColor(161, 161, 170);
          pdf.setFontSize(10);
          pdf.text('Subject', 25, yPosition + 25);
          pdf.text('Credits', pageWidth - 120, yPosition + 25);
          pdf.text('Grade', pageWidth - 80, yPosition + 25);
          pdf.text('Points', pageWidth - 40, yPosition + 25);
          // Draw border line below headings
          pdf.setDrawColor(80, 80, 80);
          pdf.setLineWidth(0.5);
          pdf.line(25, yPosition + 27, pageWidth - 25, yPosition + 27);
          semester.subjects.forEach((subject, subIndex) => {
            const subjectY = yPosition + 35 + (subIndex * 8);
            
            pdf.setTextColor(255, 255, 255);
            pdf.text(subject.name, 25, subjectY);
            
            pdf.setTextColor(161, 161, 170);
            pdf.text(subject.credits.toString(), pageWidth - 115, subjectY);
            
            const gradeColors = {
              'A+': [16, 185, 129], 'A': [34, 197, 94], 'B+': [59, 130, 246],
              'B': [6, 182, 212], 'C+': [245, 158, 11], 'C': [249, 115, 22],
              'D': [239, 68, 68], 'F': [220, 38, 38]
            };
            const gradeColor = gradeColors[subject.grade as keyof typeof gradeColors] || [255, 255, 255];
            pdf.setTextColor(gradeColor[0], gradeColor[1], gradeColor[2]);
            pdf.text(subject.grade, pageWidth - 75, subjectY);
            
            pdf.setTextColor(161, 161, 170);
            pdf.text(subject.gradePoints.toString(), pageWidth - 35, subjectY);
          });
        }
        
        yPosition += semesterHeight + 10;
      });
    }
    
    // Footer
    if (yPosition > pageHeight - 30) {
      pdf.addPage();
      pdf.setFillColor(15, 15, 15);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');
    }
    
    pdf.setFillColor(26, 26, 26);
    pdf.roundedRect(15, pageHeight - 35, pageWidth - 30, 20, 4, 4, 'F');
    
    pdf.setTextColor(161, 161, 170);
    pdf.setFontSize(10);
    pdf.text(`Generated on ${new Date().toLocaleDateString()}`, 25, pageHeight - 22);
    pdf.text('KIIT-CONNECT Academic Calculator', pageWidth - 25, pageHeight - 22, { align: 'right' });
    
    const fileName = `${type.toUpperCase()}_Report_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
    toast.success(`${type.toUpperCase()} report generated successfully!`);
  };

  const getBranchIcon = (branch: keyof typeof branches) => {
    const icons = {
      'CSE': <Code className="w-5 h-5" />,
      'CSSE': <Code className="w-5 h-5" />,
      'CSCE': <Code className="w-5 h-5" />,
      'IT': <Code className="w-5 h-5" />
    };
    return icons[branch];
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <header className="text-center space-y-4 py-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-500/30" aria-hidden="true">
              <GraduationCap className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              Advanced Academic Calculator
            </h1>
          </div>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Comprehensive academic performance tracker with SGPA, CGPA, and branch-specific aggregate calculations for KIIT students
          </p>
        </header>

        {/* Main Calculator Section */}
        <section aria-label="Academic Calculator Tools">
          <Tabs defaultValue="sgpa" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-900/50 border border-gray-800" role="tablist">
              <TabsTrigger value="sgpa" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white" role="tab" aria-selected="true">
                <Calculator className="w-4 h-4 mr-2" aria-hidden="true" />
                SGPA Calculator
              </TabsTrigger>
              <TabsTrigger value="cgpa" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white" role="tab" aria-selected="false">
                <BarChart3 className="w-4 h-4 mr-2" aria-hidden="true" />
                CGPA Calculator
              </TabsTrigger>
              <TabsTrigger value="aggregate" className="data-[state=active]:bg-green-600 data-[state=active]:text-white" role="tab" aria-selected="false">
                <Award className="w-4 h-4 mr-2" aria-hidden="true" />
                Aggregate Calculator
              </TabsTrigger>
            </TabsList>

            {/* SGPA Calculator */}
            <TabsContent value="sgpa" className="space-y-6" role="tabpanel" aria-labelledby="sgpa-tab">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Branch and Semester Selection */}
                  <Card className="bg-gray-900/70 border-gray-800 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Target className="w-5 h-5 text-blue-400" aria-hidden="true" />
                        Branch & Semester Selection
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="branch-select" className="text-gray-300 text-sm mb-2 block">Select Branch</Label>
                          <Select
                            value={sgpaCalculatorState.selectedBranch}
                            onValueChange={(value) => updateSgpaBranch(value as keyof typeof branchSubjects)}
                          >
                            <SelectTrigger id="branch-select" className="bg-gray-800 border-gray-600 text-white focus:border-blue-500">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-600">
                              {Object.entries(branches).map(([key, name]) => (
                                <SelectItem key={key} value={key} className="text-white hover:bg-gray-700">
                                  <div className="flex items-center gap-2">
                                    {getBranchIcon(key as keyof typeof branches)}
                                    <div>
                                      <p className="font-medium">{key}</p>
                                      <p className="text-xs text-gray-400">{name}</p>
                                    </div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="semester-select" className="text-gray-300 text-sm mb-2 block">Select Semester</Label>
                          <Select
                            value={sgpaCalculatorState.selectedSemester.toString()}
                            onValueChange={(value) => updateSgpaSemester(parseInt(value))}
                          >
                            <SelectTrigger id="semester-select" className="bg-gray-800 border-gray-600 text-white focus:border-blue-500">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-600">
                              {Array.from({ length: 8 }, (_, i) => i + 1).map((sem) => (
                                <SelectItem key={sem} value={sem.toString()} className="text-white hover:bg-gray-700">
                                  Semester {sem}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-900/70 border-gray-800 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Calculator className="w-5 h-5 text-blue-400" aria-hidden="true" />
                        {branches[sgpaCalculatorState.selectedBranch]} - Semester {sgpaCalculatorState.selectedSemester}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {sgpaCalculatorState.subjects.map((subject) => (
                        <div key={subject.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                          <div>
                            <Label htmlFor={`subject-${subject.id}`} className="text-gray-300 text-sm">Subject Name</Label>
                            <div className="p-2 bg-gray-800 border border-gray-600 rounded-md text-white text-sm">
                              {subject.name}
                            </div>
                          </div>
                          <div>
                            <Label htmlFor={`credits-${subject.id}`} className="text-gray-300 text-sm">Credits</Label>
                            <div className="p-2 bg-gray-800 border border-gray-600 rounded-md text-white text-sm">
                              {subject.credits}
                            </div>
                          </div>
                          <div>
                            <Label htmlFor={`grade-${subject.id}`} className="text-gray-300 text-sm">Grade</Label>
                            <Select
                              value={subject.grade}
                              onValueChange={(value) => updateSgpaSubject(subject.id, 'grade', value)}
                            >
                              <SelectTrigger id={`grade-${subject.id}`} className="bg-gray-800 border-gray-600 text-white focus:border-blue-500">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 border-gray-600">
                                {Object.entries(gradeScale).map(([grade, points]) => (
                                  <SelectItem key={grade} value={grade} className="text-white hover:bg-gray-700">
                                    {grade} ({points} points)
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-end">
                            <Badge className={getGradeColor(subject.grade)} aria-label={`Grade points: ${subject.gradePoints}`}>
                              {subject.gradePoints} pts
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                <aside className="space-y-6">
                  <Card className="bg-gray-900/70 border-gray-800 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-400" aria-hidden="true" />
                        SGPA Result
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="text-center p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-gray-700">
                        <p className="text-gray-300 text-sm mb-2">Current SGPA</p>
                        <p className="text-4xl font-bold text-blue-400" aria-label={`SGPA: ${sgpaResult.toFixed(2)}`}>{sgpaResult.toFixed(2)}</p>
                        <p className="text-sm text-gray-400 mt-2">{getCGPAStatus(sgpaResult).status}</p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Total Subjects</span>
                          <span className="text-gray-300">{sgpaCalculatorState.subjects.length}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Total Credits</span>
                          <span className="text-gray-300">{sgpaCalculatorState.subjects.reduce((sum, sub) => sum + sub.credits, 0)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Branch</span>
                          <span className="text-gray-300">{sgpaCalculatorState.selectedBranch}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Semester</span>
                          <span className="text-gray-300">{sgpaCalculatorState.selectedSemester}</span>
                        </div>
                      </div>

                      <Button 
                        onClick={() => generatePDF('sgpa', { 
                          subjects: sgpaCalculatorState.subjects, 
                          sgpa: sgpaResult,
                          branch: sgpaCalculatorState.selectedBranch,
                          semester: sgpaCalculatorState.selectedSemester
                        })}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
                        disabled={sgpaCalculatorState.subjects.length === 0}
                        aria-label="Generate SGPA Report PDF"
                      >
                        <Download className="w-4 h-4 mr-2" aria-hidden="true" />
                        Generate SGPA Report
                      </Button>
                    </CardContent>
                  </Card>
                </aside>
              </div>
            </TabsContent>

            {/* CGPA Calculator */}
            <TabsContent value="cgpa" className="space-y-6" role="tabpanel" aria-labelledby="cgpa-tab">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <Card className="bg-gray-900/70 border-gray-800 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white flex items-center gap-2">
                          <BarChart3 className="w-5 h-5 text-purple-400" aria-hidden="true" />
                          CGPA from SGPA Calculator
                        </CardTitle>
                        <Button 
                          onClick={addCgpaSemester}
                          className="bg-purple-600 hover:bg-purple-700 text-white border-0"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Semester
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {cgpaSemesters.map((semester) => (
                        <div key={semester.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                          <div>
                            <Label className="text-gray-300 text-sm">Semester Name</Label>
                            <Input
                              placeholder="Enter semester name"
                              value={semester.name}
                              onChange={(e) => updateCgpaSemester(semester.id, 'name', e.target.value)}
                              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
                            />
                          </div>
                          <div>
                            <Label className="text-gray-300 text-sm">SGPA</Label>
                            <Input
                              type="number"
                              min="0"
                              max="10"
                              step="0.01"
                              value={semester.sgpa}
                              onChange={(e) => updateCgpaSemester(semester.id, 'sgpa', parseFloat(e.target.value) || 0)}
                              className="bg-gray-800 border-gray-600 text-white focus:border-purple-500"
                            />
                          </div>
                          <div>
                            <Label className="text-gray-300 text-sm">Credits</Label>
                            <Input
                              type="number"
                              min="1"
                              max="40"
                              value={semester.credits}
                              onChange={(e) => updateCgpaSemester(semester.id, 'credits', parseFloat(e.target.value) || 20)}
                              className="bg-gray-800 border-gray-600 text-white focus:border-purple-500"
                            />
                          </div>
                          <div className="flex items-end">
                            {cgpaSemesters.length > 1 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteCgpaSemester(semester.id)}
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card className="bg-gray-900/70 border-gray-800 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Award className="w-5 h-5 text-purple-400" aria-hidden="true" />
                        CGPA Result
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="text-center p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-gray-700">
                        <p className="text-gray-300 text-sm mb-2">Overall CGPA</p>
                        <p className="text-4xl font-bold text-purple-400">{cgpaResult.toFixed(2)}</p>
                        <p className="text-sm text-gray-400 mt-2">{getCGPAStatus(cgpaResult).status}</p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Total Semesters</span>
                          <span className="text-gray-300">{cgpaSemesters.length}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Total Credits</span>
                          <span className="text-gray-300">{cgpaSemesters.reduce((sum, sem) => sum + sem.credits, 0)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Average SGPA</span>
                          <span className="text-gray-300">
                            {cgpaSemesters.length > 0 ? (cgpaSemesters.reduce((sum, sem) => sum + sem.sgpa, 0) / cgpaSemesters.length).toFixed(2) : '0.00'}
                          </span>
                        </div>
                      </div>

                      <Button 
                        onClick={() => generatePDF('cgpa', { semesters: cgpaSemesters, cgpa: cgpaResult })}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
                        disabled={cgpaSemesters.length === 0}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Generate CGPA Report
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Aggregate Calculator */}
            <TabsContent value="aggregate" className="space-y-6" role="tabpanel" aria-labelledby="aggregate-tab">
              {/* Branch Selection */}
              <Card className="bg-gray-900/70 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-400" aria-hidden="true" />
                    Branch & Semester Range Selection
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-gray-300 text-sm mb-3 block">Select Branch</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {Object.entries(branches).map(([key, name]) => (
                        <Button
                          key={key}
                          variant={selectedBranch === key ? "default" : "outline"}
                          onClick={() => setSelectedBranch(key as keyof typeof branches)}
                          className={`p-4 h-auto flex flex-col items-center gap-2 ${
                            selectedBranch === key 
                              ? 'bg-green-600 hover:bg-green-700 text-white border-0' 
                              : 'border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white'
                          }`}
                        >
                          <div className="p-2 bg-green-500/20 rounded-lg">
                            {getBranchIcon(key as keyof typeof branches)}
                          </div>
                          <div className="text-center">
                            <p className="font-semibold">{key}</p>
                            <p className="text-xs opacity-80">{name}</p>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <Separator className="bg-gray-700" />
                  
                  <div>
                    <Label className="text-gray-300 text-sm mb-3 block">Calculate CGPA from Semester Range</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300 text-xs mb-2 block">From Semester</Label>
                        <Select
                          value={aggregateFromSemester.toString()}
                          onValueChange={(value) => {
                            const fromSem = parseInt(value);
                            setAggregateFromSemester(fromSem);
                            if (fromSem > aggregateToSemester) {
                              setAggregateToSemester(fromSem);
                            }
                          }}
                        >
                          <SelectTrigger className="bg-gray-800 border-gray-600 text-white focus:border-green-500">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-600">
                            {Array.from({ length: 8 }, (_, i) => i + 1).map((sem) => (
                              <SelectItem key={sem} value={sem.toString()} className="text-white hover:bg-gray-700">
                                Semester {sem}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-gray-300 text-xs mb-2 block">To Semester</Label>
                        <Select
                          value={aggregateToSemester.toString()}
                          onValueChange={(value) => {
                            const toSem = parseInt(value);
                            if (toSem >= aggregateFromSemester) {
                              setAggregateToSemester(toSem);
                            }
                          }}
                        >
                          <SelectTrigger className="bg-gray-800 border-gray-600 text-white focus:border-green-500">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-600">
                            {Array.from({ length: 8 }, (_, i) => i + 1)
                              .filter(sem => sem >= aggregateFromSemester)
                              .map((sem) => (
                              <SelectItem key={sem} value={sem.toString()} className="text-white hover:bg-gray-700">
                                Semester {sem}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <p className="text-gray-400 text-xs mt-2">
                      Calculating CGPA from Semester {aggregateFromSemester} to {aggregateToSemester}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Remove the old branch selection section */}
              {/* <Card className="bg-gray-900/70 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-400" />
                    Branch Selection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(branches).map(([key, name]) => (
                      <Button
                        key={key}
                        variant={selectedBranch === key ? "default" : "outline"}
                        onClick={() => setSelectedBranch(key as keyof typeof branches)}
                        className={`p-4 h-auto flex flex-col items-center gap-2 ${
                          selectedBranch === key 
                            ? 'bg-green-600 hover:bg-green-700 text-white border-0' 
                            : 'border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white'
                        }`}
                      >
                        <div className="p-2 bg-green-500/20 rounded-lg">
                          {getBranchIcon(key as keyof typeof branches)}
                        </div>
                        <div className="text-center">
                          <p className="font-semibold">{key}</p>
                          <p className="text-xs opacity-80">{name}</p>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card> */}

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500/20 rounded-lg">
                        <Award className="w-5 h-5 text-green-400" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Overall CGPA</p>
                        <p className="text-2xl font-bold text-green-400">{aggregateCgpa.toFixed(2)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <BookOpen className="w-5 h-5 text-blue-400" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Total Credits</p>
                        <p className="text-2xl font-bold text-blue-400">{totalCredits}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-500/20 rounded-lg">
                        <BarChart3 className="w-5 h-5 text-purple-400" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Semesters</p>
                        <p className="text-2xl font-bold text-purple-400">{aggregateToSemester - aggregateFromSemester + 1}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-500/20 rounded-lg">
                        <FileText className="w-5 h-5 text-orange-400" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Performance</p>
                        <p className={`text-lg font-semibold ${getCGPAStatus(aggregateCgpa).color}`}>
                          {getCGPAStatus(aggregateCgpa).status}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Semester Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {aggregateSemesters
                  .filter((semester, index) => {
                    const semesterNumber = index + 1;
                    return semesterNumber >= aggregateFromSemester && semesterNumber <= aggregateToSemester;
                  })
                  .map((semester) => (
                  <Card key={semester.id} className="bg-gray-900/70 border-gray-800 backdrop-blur-sm">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          {semester.name}
                        </CardTitle>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          SGPA: {semester.sgpa.toFixed(2)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {semester.subjects.map((subject) => (
                        <div key={subject.id} className="grid grid-cols-3 gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                          <div>
                            <p className="text-white text-sm font-medium">{subject.name}</p>
                            <p className="text-gray-400 text-xs">Credits: {subject.credits}</p>
                          </div>
                          <div>
                            <Select
                              value={subject.grade}
                              onValueChange={(value) => updateAggregateSubject(semester.id, subject.id, value)}
                            >
                              <SelectTrigger className="bg-gray-800 border-gray-600 text-white focus:border-green-500 h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 border-gray-600">
                                {Object.entries(gradeScale).map(([grade, points]) => (
                                  <SelectItem key={grade} value={grade} className="text-white hover:bg-gray-700">
                                    {grade} ({points})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-center">
                            <Badge className={getGradeColor(subject.grade)}>
                              {subject.gradePoints} pts
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Generate Report Button */}
              <div className="flex justify-center">
                <Button 
                  onClick={() => generatePDF('aggregate', { 
                    branch: selectedBranch, 
                    semesters: aggregateSemesters, 
                    cgpa: aggregateCgpa,
                    totalCredits,
                    fromSemester: aggregateFromSemester,
                    toSemester: aggregateToSemester
                  })}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0 px-8 py-3 text-lg"
                >
                  <Download className="w-5 h-5 mr-2" aria-hidden="true" />
                  Generate Comprehensive Report
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </main>
  );
}
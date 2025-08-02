'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
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
  Zap,
  Database
} from 'lucide-react';
import jsPDF from 'jspdf';

interface StudentDetails {
  name: string;
  rollNumber: string;
  branch: string;
  email: string;
  phone: string;
  year: string;
}

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
  'O': 10,
  'E': 9,
  'A': 8,
  'B': 7,
  'C': 6,
  'D': 5,
  'F': 2
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
      {
        name: "PHYSICS",
        credits: "3",
        SUBCODE: "PH10001",
        grade:"O",
      },
      {
        name: "Differential Equations and Linear Algebra",
        credits: "4",
        SUBCODE: "MA11001",
        grade:"O",
      },
      {
        name: "SCIENCE OF LIVING SYSTEMS",
        credits: "2",
        SUBCODE: "LS10001",
        grade:"O",
      },
      {
        name: "ENVIROMENTAL SCIENCE",
        credits: "2",
        SUBCODE: "CH10003",
        grade:"O",
      },
      {
        name: "PHYSICS LAB",
        credits: "1",
        SUBCODE: "PH19001",
        grade:"O",
      },
      {
        name: "PROGRAMMING LAB",
        credits: "4",
        SUBCODE: "CS19001",
        grade:"O",
      },
      {
        name: "ENGINEERING DRAWING & GRAPHICS",
        credits: "1",
        SUBCODE: "CE18001",
        grade:"O",
      },
      {
        name: "ENGINEERING ELECTIVE-II",
        credits: "2",
        SUBCODE: null,
        grade:"O",
      },
      {
        name: "SCIENCE ELECTIVE",
        credits: "2",
        SUBCODE: null,
        grade:"O",
      },
    ],

    2: [
      {
        name: "CHEMISTRY",
        credits: "3",
        SUBCODE: "CH10001",
        grade:"O",
      },
      {
        name: "Transform Calculus and Numerical Analysis",
        credits: "4",
        SUBCODE: "MA11002",
        grade:"O",
      },
      {
        name: "ENGLISH",
        credits: "2",
        SUBCODE: "HS10001",
        grade:"O",
      },
      {
        name: "BASIC ELECTRONICS",
        credits: "2",
        SUBCODE: "EC10001",
        grade:"O",
      },
      {
        name: "CHEMISTRY LAB",
        credits: "1",
        SUBCODE: "CH19001",
        grade:"O",
      },
      {
        name: "YOGA",
        credits: "1",
        SUBCODE: "YG18001",
        grade:"O",
      },
      {
        name: "ENGINEERING LAB",
        credits: "1",
        SUBCODE: "EX19001",
        grade:"O",
      },
      {
        name: "WORKSHOP",
        credits: "1",
        SUBCODE: "ME18001",
         Grade:"O",
      },
      {
        name: "COMMUNICATION LAB",
        credits: "1",
        SUBCODE: "HS18001",
         Grade:"O",
      },
      {
        name: "ENGINEERING ELECTIVE-I",
        credits: "2",
        SUBCODE: null,
         Grade:"O",
      },
      {
        name: "SOCIAL SCIENCE ELECTIVE",
        credits: "2",
        SUBCODE: null,
         Grade:"O",
      },
    ],
    3: [
      {
        name: "DS",
        Credit: "4",
        SUBCODE: "CS2001",
         Grade:"O",
      },
      {
        name: "Digital Systems Design",
        Credit: "3",
        SUBCODE: "EC20005",
         Grade:"O",
      },
      {
        name: "Scientific and Technical Writing",
        Credit: "2",
        SUBCODE: "EX20003",
         Grade:"-1",
      },
      //  {
      //   name: "HASS Elective - II",
      //   Credit: "3",
      //   SUBCODE: "EX20003",
      //    Grade:"-1",
      // },
      {
        name: "Industry 4.0 Technologies",
        Credit: "2",
        SUBCODE: "EX20001",
         Grade:"O",
      },
      {
        name: "Automata Theory and Formal Languages",
        Credit: "4",
        SUBCODE: "CS21003",
         Grade:"O",
      },
      {
        name: "PS",
        Credit: "4",
        SUBCODE: "MA2011",
         Grade:"O",
      },
      {
        name: "DSA LAB",
        Credit: "1",
        SUBCODE: "CS2091",
         Grade:"O",
      },
      {
        name: "Digital Systems Design LAB",
        Credit: "1",
        SUBCODE: "EC29005",
         Grade:"O",
      },
    ],
    4: [
      {
        name: "Scientific and Technical Writing",
        Credit: "2",
        SUBCODE: "EX20003",
         Grade:"-1",
      },
       {
        name: "HASS Elective - II",
        Credit: "3",
        SUBCODE: "EX20003",
         Grade:"-1",
      },

      

      {
        name: "OOPJ",
        Credit: "3",
        SUBCODE: "CS20004",
         Grade:"O",
      },
      {
        name: "OS",
        Credit: "3",
        SUBCODE: "CS2002",
         Grade:"O",
      },
      {
        name: "Discrete Structures",
        Credit: "4",
        SUBCODE: "MA21002",
         Grade:"O",
      },
      {
        name: "COA",
        Credit: "4",
        SUBCODE: "CS21002",
         Grade:"O",
      },
  
      {
        name: "DBMS",
        Credit: "3",
        SUBCODE: "CS20006",
         Grade:"O",
      },
      {
        name: "OOPJ LAB",
        Credit: "1",
        SUBCODE: "CS29004",
         Grade:"O",
      },
      {
        name: "OS LAB",
        Credit: "1",
        SUBCODE: "CS29002",
         Grade:"O",
      },
      {
        name: "DBMS LAB",
        Credit: "1",
        SUBCODE: "CS29006",
         Grade:"O",
      },
      {
        name: "Vocational Electives",
        Credit: "1",
        SUBCODE: "CS28001",
         Grade:"O",
      },
    ],
    5: [
      {
        name: "COMPUTER NETWORKS",
        Credit: "3",
        SUBCODE: "IT3009",
         Grade:"O",
      },
      {
        name: "DESIGN & ANALYSIS OF ALGO", 
        Credit: "3",
        SUBCODE: "CS2012",
         Grade:"O",
      },
      
      {
        name: "SOFTWARE ENGINEERING",
        Credit: "4",
        SUBCODE: "IT3003",
         Grade:"O",
      },
      {
        name: "Engineering Economics",
        Credit: "3",
        SUBCODE: "HS30101",
         Grade:"O",
      },
      {
        name: "NETWORK LAB",
         Grade:"O",
        Credit: "1",
        SUBCODE: "IT3095",
      },
      {
        name: "ALGORITHM LAB",
        Credit: "1",
        SUBCODE: "CS2098",
         Grade:"O",
      },
      {
        name: "Professional Elective-1",
        Credit: "3",
        SUBCODE: null,
         Grade:"O",
      },
      {
        name: "Professional Elective-2",
        Credit: "3",
        SUBCODE: null,
         Grade:"O",
      },
      {
        name: "K-Explore Open Elective-I",
        Credit: "1",
        SUBCODE: "CS3010",
         Grade:"O",
      },
    ],
    6: [
      {
        name: "UHV",
        Credit: "3",
        SUBCODE: "HS30401",
         Grade:"O",
      },
      {
        name: "AI",
        Credit: "3",
        SUBCODE: "CS30002",
         Grade:"O",
      },
      {
        name: "ML",
        Credit: "4",
        SUBCODE: "",
         Grade:"O",
      },
      {
        name: "AI LAB",
        Credit: "1",
        SUBCODE: "IT3098",
         Grade:"O",
      },
      {
        name: "MINI PROJECT",
        Credit: "2",
        SUBCODE: "CS3082",
         Grade:"O",
      },
      
      {
        name: "Application Development LAB",
        Credit: "2",
        SUBCODE: null,
         Grade:"O",
      },
      {
        name: "Professional Elective-III",
        Credit: "3",
        SUBCODE: null,
         Grade:"O",
      },
      {
        name: "HASS Elective- III ",
        Credit: "3",
        SUBCODE: null,
         Grade:"O",
      },
      {
        name: "Open Elective-II/MI-1",
        Credit: "3",
        SUBCODE: "CS30036",
         Grade:"O",
      },
    ],
    7: [
      {
        name: "HRM",
        Credit: "3",
        SUBCODE: null,
         Grade:"O",
      },
      {
        name: "PROFESSIONAL PRACTICE,LAW & ETHICS",
        Credit: "2",
        SUBCODE: "HS4001",
         Grade:"O",
      },
    
      {
        name: "PROJECT 1/INTERNSHIP",
        Credit: "3",
        SUBCODE: "CS4081",
         Grade:"O",
      },
      {
        name: "PRACTICAL TRAINING",
        Credit: "2",
        SUBCODE: "CS4083",
         Grade:"O",
      },
     
      {
        name: "Coursera Elective",
        Credit: "3",
        SUBCODE: null,
         Grade:"O",
      },
    ],
  },

  'IT': {
   1: [
      {
        name: "CHEMISTRY",
        Credit: "3",
        SUBCODE: "CH10001",
         Grade:"O",
      },
      {
        name: "Transform Calculus and Numerical Analysis",
        Credit: "4",
        SUBCODE: "MA11002",
         Grade:"O",
      },
      {
        name: "ENGLISH",
        Credit: "2",
        SUBCODE: "HS10001",
         Grade:"O",
      },
      {
        name: "BASIC ELECTRONICS",
        Credit: "2",
        SUBCODE: "EC10001",
         Grade:"O",
      },
      {
        name: "CHEMISTRY LAB",
        Credit: "1",
        SUBCODE: "CH19001",
         Grade:"O",
      },
      {
        name: "YOGA",
        Credit: "1",
        SUBCODE: "YG18001",
         Grade:"O",
      },
      {
        name: "ENGINEERING LAB",
        Credit: "1",
        SUBCODE: "EX19001",
         Grade:"O",
      },
      {
        name: "WORKSHOP",
        Credit: "1",
        SUBCODE: "ME18001",
         Grade:"O",
      },
      {
        name: "COMMUNICATION LAB",
        Credit: "1",
        SUBCODE: "HS18001",
         Grade:"O",
      },
      {
        name: "ENGINEERING ELECTIVE-I",
        Credit: "2",
        SUBCODE: null,
         Grade:"O",
      },
      {
        name: "HASS ELECTIVE-I",
        Credit: "2",
        SUBCODE: null,
         Grade:"O",
      },
    ],
    2: [
      {
        name: "PHYSICS",
        Credit: "3",
        SUBCODE: "PH10001",
         Grade:"O",
      },
      {
        name: "Differential Equations and Linear Algebra",
        Credit: "4",
        SUBCODE: "MA11001",
         Grade:"O",
      },
      {
        name: "SCIENCE OF LIVING SYSTEMS",
        Credit: "2",
        SUBCODE: "LS10001",
         Grade:"O",
      },
      {
        name: "ENVIROMENTAL SCIENCE",
        Credit: "2",
        SUBCODE: "CH10003",
         Grade:"O",
      },
      {
        name: "PHYSICS LAB",
        Credit: "1",
        SUBCODE: "PH19001",
         Grade:"O",
      },
      {
        name: "PROGRAMMING LAB",
        Credit: "4",
        SUBCODE: "CS19001",
         Grade:"O",
      },
      {
        name: "ENGINEERING DRAWING & GRAPHICS",
        Credit: "1",
        SUBCODE: "CE18001",
         Grade:"O",
      },
      {
        name: "ENGINEERING ELECTIVE-II",
        Credit: "2",
        SUBCODE: null,
         Grade:"O",
      },
      {
        name: "SCIENCE ELECTIVE",
        Credit: "2",
        SUBCODE: null,
         Grade:"O",
      },
    ],
    3: [
      {
        name: "DS",
        Credit: "4",
        SUBCODE: "CS21001",
         Grade:"O",
      },

      {
        name: "Communication Engineering",
        Credit: "3",
        SUBCODE: "EC20008",
         Grade:"O",
      },
      {
        name: "OOPJ",
        Credit: "3",
        SUBCODE: "CS20004",
         Grade:"O",
      },
      
      {
        name: "COA",
        Credit: "4",
        SUBCODE: "CS21002",
         Grade:"O",
      },
      {
        name: "PS",
        Credit: "4",
        SUBCODE: "MA21001",
         Grade:"O",
      },
      {
        name: "Scientific and Technical Writing",
        Credit: "2",
        SUBCODE: "EX20003",
         Grade:"O",
      },
      {
        name: "DS LAB",
        Credit: "1",
        SUBCODE: "CS29001",
         Grade:"O",
      },{
        name: "Communication Engineering LAB",
        Credit: "1",
        SUBCODE: "EC29002",
         Grade:"O",
      },
      {
        name: "OOPJ LAB",
        Credit: "1",
        SUBCODE: "CS29004",
         Grade:"O",
      },
    ],
    4: [
      {
        name: "Industry 4.0 Technologies",
        Credit: "2",
        SUBCODE: "EX20001",
         Grade:"O",
      },
      {
        name: "Discrete Structures",
        Credit: "4",
        SUBCODE: "MA21002",
         Grade:"O",
      },
      {
        name: "OS",
        Credit: "3",
        SUBCODE: "CS20002",
         Grade:"O",
      },

      {
        name: "Engineering Economics",
        Credit: "3",
        SUBCODE: "HS30101",
         Grade:"O",
      },
      {
        name: "Information Theory and Coding",
        Credit: "3",
        SUBCODE: "CS20008",
         Grade:"O",
      },
      {
        name: "DBMS",
        Credit: "3",
        SUBCODE: "CS20006",
         Grade:"O",
      },
      
      {
        name: "OS LAB",
        Credit: "1",
        SUBCODE: "CS29002",
         Grade:"O",
      },
      {
        name: "DBMS LAB",
        Credit: "1",
        SUBCODE: "CS29004",
         Grade:"O",
      },
      {
        name: "Vocational Electives",
        Credit: "1",
        SUBCODE: "CS28001",
         Grade:"O",
      },
    ],
    5: [
      {
        name: "COMPUTER NETWORKS",
        Credit: "3",
        SUBCODE: "IT3005",
         Grade:"O",
      },
      {
        name: "DESIGN & ANALYSIS OF ALGO",
        Credit: "3",
        SUBCODE: "CS2012",
         Grade:"O",
      },
      {
        name: "IOT",
        Credit: "3",
        SUBCODE: "IT3007",
         Grade:"O",
      },
      {
        name: "SOFTWARE ENGINEERING",
        Credit: "4",
        SUBCODE: "IT3003",
         Grade:"O",
      },
      {
        name: "NETWORK LAB",
        Credit: "1",
        SUBCODE: "IT3095",
         Grade:"O",
      },
      {
        name: "ALGORITHM LAB",
        Credit: "1",
        SUBCODE: "CS2098",
         Grade:"O",
      },
      {
        name: "ELECTIVE-1",
        Credit: "3",
        SUBCODE: null,
         Grade:"O",
      },
      {
        name: "ELECTIVE-2",
        Credit: "3",
        SUBCODE: null,
         Grade:"O",
      },
    ],
    6: [
      {
        name: "HASS Elective -III",
        Credit: "3",
        SUBCODE: null,
         Grade:"O",
      },
      {
        name: "Machine Learning",
        Credit: "4",
        SUBCODE: "CS31002",
         Grade:"O",
      },
      {
        name: "Data Science and Analytics",
        Credit: "3",
        SUBCODE: "CS30004",
         Grade:"O",
      },
      {
        name: "Professional Elective-III",
        Credit: "3",
        SUBCODE: "IT3098",
         Grade:"O",
      },
      {
        name: "Open Elective–II/ MI-I",
        Credit: "3",
        SUBCODE: "CS3082",
         Grade:"O",
      },
      {
        name: "Universal Human Values",
        Credit: "3",
        SUBCODE: null,
         Grade:"O",
      },
      {
        name: "Data Analytics Laboratory",
        Credit: "1",
        SUBCODE: null,
         Grade:"O",
      },
      {
        name: "Advance Programming Laboratory",
        Credit: "2",
        SUBCODE: null,
         Grade:"O",
      },
      {
        name: "Mini Project",
        Credit: "2",
        SUBCODE: null,
         Grade:"O",
      },
    ],
    7: [
      {
        name: "HRM",
        Credit: "3",
        SUBCODE: null,
         Grade:"O",
      },
      {
        name: "PROFESSIONAL PRACTICE,LAW & ETHICS",
        Credit: "2",
        SUBCODE: "HS4001",
         Grade:"O",
      },
    
      {
        name: "PROJECT 1/INTERNSHIP",
        Credit: "3",
        SUBCODE: "CS4081",
         Grade:"O",
      },
      {
        name: "PRACTICAL TRAINING",
        Credit: "2",
        SUBCODE: "CS4083",
         Grade:"O",
      },
     
      {
        name: "Coursera Elective",
        Credit: "3",
        SUBCODE: null,
         Grade:"O",
      }
      
    ],
  },

  'CSCE': {
   1: [
      {
        name: "CHEMISTRY",
        Credit: "3",
        SUBCODE: "CH10001",
         Grade:"O",
      },
      {
        name: "Transform Calculus and Numerical Analysis",
        Credit: "4",
        SUBCODE: "MA11002",
         Grade:"O",
      },
      {
        name: "ENGLISH",
        Credit: "2",
        SUBCODE: "HS10001",
         Grade:"O",
      },
      {
        name: "BASIC ELECTRONICS",
        Credit: "2",
        SUBCODE: "EC10001",
         Grade:"O",
      },
      {
        name: "CHEMISTRY LAB",
        Credit: "1",
        SUBCODE: "CH19001",
         Grade:"O",
      },
      {
        name: "YOGA",
        Credit: "1",
        SUBCODE: "YG18001",
         Grade:"O",
      },
      {
        name: "ENGINEERING LAB",
        Credit: "1",
        SUBCODE: "EX19001",
         Grade:"O",
      },
      {
        name: "WORKSHOP",
        Credit: "1",
        SUBCODE: "ME18001",
         Grade:"O",
      },
      {
        name: "COMMUNICATION LAB",
        Credit: "1",
        SUBCODE: "HS18001",
         Grade:"O",
      },
      {
        name: "ENGINEERING ELECTIVE-I",
        Credit: "2",
        SUBCODE: null,
         Grade:"O",
      },
      {
        name: "HASS Elective - I",
        Credit: "2",
        SUBCODE: null,
         Grade:"O",
      },
    ],
    2: [
      {
        name: "PHYSICS",
        Credit: "3",
        SUBCODE: "PH10001",
         Grade:"O",
      },
      {
        name: "Differential Equations and Linear Algebra",
        Credit: "4",
        SUBCODE: "MA11001",
         Grade:"O",
      },
      {
        name: "SCIENCE OF LIVING SYSTEMS",
        Credit: "2",
        SUBCODE: "LS10001",
         Grade:"O",
      },
      {
        name: "ENVIROMENTAL SCIENCE",
        Credit: "2",
        SUBCODE: "CH10003",
         Grade:"O",
      },
      {
        name: "PHYSICS LAB",
        Credit: "1",
        SUBCODE: "PH19001",
         Grade:"O",
      },
      {
        name: "PROGRAMMING LAB",
        Credit: "4",
        SUBCODE: "CS19001",
         Grade:"O",
      },
      {
        name: "ENGINEERING DRAWING & GRAPHICS",
        Credit: "1",
        SUBCODE: "CE18001",
         Grade:"O",
      },
      {
        name: "ENGINEERING ELECTIVE-II",
        Credit: "2",
        SUBCODE: null,
         Grade:"O",
      },
      {
        name: "SCIENCE ELECTIVE",
        Credit: "2",
        SUBCODE: null,
         Grade:"O",
      },
    ],
    3: [
      {
        name: "DS",
        Credit: "4",
        SUBCODE: "CS21001",
         Grade:"O",
      },

      {
        name: "Scientific and Technical Writing",
        Credit: "2",
        SUBCODE: "EX20003",
         Grade:"O",
      },
      {
        name: "Industry 4.0 Technologies",
        Credit: "2",
        SUBCODE: "EX20001",
         Grade:"O",
      },
      {
        name: "Digital Systems Design",
        Credit: "3",
        SUBCODE: "EC20005",
         Grade:"O",
      },
      {
        name: "PS",
        Credit: "4",
        SUBCODE: "MA21001",
         Grade:"O",
      },
      {
        name: "Communication Engineering",
        Credit: "3",
        SUBCODE: "EC20008",
         Grade:"O",
      },
      {
        name: "DS LAB",
        Credit: "1",
        SUBCODE: "CS29001",
         Grade:"O",
      },
      {
        name: "Communication Engineering LAB",
        Credit: "1",
        SUBCODE: "EC29002",
         Grade:"O",
      },
      {
        name: "DSD LAB",
        Credit: "1",
        SUBCODE: "EC29005",
         Grade:"O",
      },
    ],
    4: [
      {
        name: "OOPJ",
        Credit: "3",
        SUBCODE: "CS20004",
         Grade:"O",
      },
      {
        name: "Discrete Structures",
        Credit: "4",
        SUBCODE: "MA21002",
         Grade:"O",
      },
      {
        name: "OS",
        Credit: "3",
        SUBCODE: "CS20002",
         Grade:"O",
      },
      {
        name: "Engineering Economics",
        Credit: "3",
        SUBCODE: "HS30101",
         Grade:"O",
      },

      
      {
        name: "Information Security",
        Credit: "3",
        SUBCODE: "CS20010",
         Grade:"O",
      },
      {
        name: "DBMS",
        Credit: "3",
        SUBCODE: "CS20006",
         Grade:"O",
      },
      {
        name: "OOPJ LAB",
        Credit: "1",
        SUBCODE: "CS29004",
         Grade:"O",
      },
      {
        name: "OS LAB",
        Credit: "1",
        SUBCODE: "CS29002",
         Grade:"O",
      },
      {
        name: "DBMS LAB",
        Credit: "1",
        SUBCODE: "CS29006",
         Grade:"O",
      },
      {
        name: "Vocational Electives",
        Credit: "1",
        SUBCODE: "CS28001",
         Grade:"O",
      },
    ],
    5: [
      {
        name: "COMPUTER NETWORKS",
        Credit: "3",
        SUBCODE: "IT3005",
         Grade:"O",
      },
      {
        name: "DESIGN & ANALYSIS OF ALGO",
        Credit: "3",
        SUBCODE: "CS2012",
         Grade:"O",
      },
      {
        name: "DBMS",
        Credit: "4",
        SUBCODE: "CS2004",
         Grade:"O",
      },
      {
        name: "SOFTWARE ENGINEERING",
        Credit: "4",
        SUBCODE: "IT3003",
         Grade:"O",
      },
      {
        name: "NETWORK LAB",
        Credit: "1",
        SUBCODE: "IT3095",
         Grade:"O",
      },
      {
        name: "ALGORITHM LAB",
        Credit: "1",
        SUBCODE: "CS2098",
         Grade:"O",
      },
      {
        name: "ELECTIVE-1",
        Credit: "3",
        SUBCODE: null,
         Grade:"O",
      },
      {
        name: "ELECTIVE-2",
        Credit: "3",
        SUBCODE: null,
         Grade:"O",
      },
      {
        name: "DBMS LAB",
        Credit: "1",
        SUBCODE: "CS2094",
         Grade:"O",
      },
    ],
    6: [
      {
        name: "HASS Elective – III",
        Credit: "3",
        SUBCODE: "EC 3036",
         Grade:"O",
      },
      {
        name: "Cloud Computing",
        Credit: "3",
        SUBCODE: "IT 3022",
         Grade:"O",
      },
      {
        name: "Wireless Mobile Communication",
        Credit: "3",
        SUBCODE: null,
         Grade:"O",
      },{
        name: "Professional Elective - III",
        Credit: "3",
        SUBCODE: null,
         Grade:"O",
      },{
        name: "Open Elective – II / MI-I",
        Credit: "3",
        SUBCODE: null,
         Grade:"O",
      },
      
    
      {
        name: "Universal Human Values",
        Credit: "3",
        SUBCODE: null,
         Grade:"O",
      },
      {
        name: "Wireless Communication & Networking Lab",
        Credit: "1",
        SUBCODE: null,
         Grade:"O",
      },
       {
        name: "Advance Programming Laboratory",
        Credit: "2",
        SUBCODE: null,
         Grade:"O",
      },{
        name: "Mini Project",
        Credit: "2",
        SUBCODE: null,
         Grade:"O",
      },
    ],
    7: [
      {
        name: "SEMESESTE-7",
        Credit: "3",
        SUBCODE: "CH10001",
         Grade:"O",
      },
      {
        name: "MATHEMATICS-II",
        Credit: "4",
        SUBCODE: "MA11002",
         Grade:"O",
      },
      {
        name: "ENGLISH",
        Credit: "2",
        SUBCODE: "HS10001",
         Grade:"O",
      },
      {
        name: "BASIC ELECTRONICS",
        Credit: "2",
        SUBCODE: "EC10001",
         Grade:"O",
      },
      {
        name: "CHEMISTRY LAB",
        Credit: "1",
        SUBCODE: "CH19001",
         Grade:"O",
      },
      {
        name: "YOGA",
        Credit: "1",
        SUBCODE: "YG18001",
         Grade:"O",
      },
      {
        name: "ENGINEERING LAB",
        Credit: "1",
        SUBCODE: "EX19001",
         Grade:"O",
      },
      {
        name: "WORKSHOP",
        Credit: "1",
        SUBCODE: "ME18001",
         Grade:"O",
      },
      {
        name: "COMMUNICATION LAB",
        Credit: "1",
        SUBCODE: "HS18001",
         Grade:"O",
      },
      {
        name: "ENGINEERING ELECTIVE-I",
        Credit: "2",
        SUBCODE: null,
         Grade:"O",
      },
      {
        name: "SOCIAL SCIENCE ELECTIVE",
        Credit: "2",
        SUBCODE: null,
         Grade:"O",
      },
    ],
    "8": [
      {
        name: "SEMESTER-8",
        Credit: "3",
        SUBCODE: "CH10001",
         Grade:"O",
      },
      {
        name: "MATHEMATICS-II",
        Credit: "4",
        SUBCODE: "MA11002",
         Grade:"O",
      },
      {
        name: "ENGLISH",
        Credit: "2",
        SUBCODE: "HS10001",
         Grade:"O",
      },
      {
        name: "BASIC ELECTRONICS",
        Credit: "2",
        SUBCODE: "EC10001",
         Grade:"O",
      },
      {
        name: "CHEMISTRY LAB",
        Credit: "1",
        SUBCODE: "CH19001",
         Grade:"O",
      },
      {
        name: "YOGA",
        Credit: "1",
        SUBCODE: "YG18001",
         Grade:"O",
      },
      {
        name: "ENGINEERING LAB",
        Credit: "1",
        SUBCODE: "EX19001",
         Grade:"O",
      },
      {
        name: "WORKSHOP",
        Credit: "1",
        SUBCODE: "ME18001",
         Grade:"O",
      },
      {
        name: "COMMUNICATION LAB",
        Credit: "1",
        SUBCODE: "HS18001",
         Grade:"O",
      },
      {
        name: "ENGINEERING ELECTIVE-I",
        Credit: "2",
        SUBCODE: null,
         Grade:"O",
      },
      {
        name: "SOCIAL SCIENCE ELECTIVE",
        Credit: "2",
        SUBCODE: null,
         Grade:"O",
      },
    ],
  },

  'CSSE': {
   1: [
      {
        name: "CHEMISTRY",
        Credit: "3",
        SUBCODE: "CH10001",
         Grade:"O",
      },
      {
        name: "Transform Calculus and Numerical Analysis",
        Credit: "4",
        SUBCODE: "MA11002",
         Grade:"O",
      },
      {
        name: "ENGLISH",
        Credit: "2",
        SUBCODE: "HS10001",
         Grade:"O",
      },
      {
        name: "BASIC ELECTRONICS",
        Credit: "2",
        SUBCODE: "EC10001",
         Grade:"O",
      },


      {
        name: "CHEMISTRY LAB",
        Credit: "1",
        SUBCODE: "CH19001",
         Grade:"O",
      },
      {
        name: "YOGA",
        Credit: "1",
        SUBCODE: "YG18001",
         Grade:"O",
      },
      {
        name: "ENGINEERING LAB",
        Credit: "1",
        SUBCODE: "EX19001",
         Grade:"O",
      },
      {
        name: "WORKSHOP",
        Credit: "1",
        SUBCODE: "ME18001",
         Grade:"O",
      },
      {
        name: "COMMUNICATION LAB",
        Credit: "1",
        SUBCODE: "HS18001",
         Grade:"O",
      },
      {
        name: "ENGINEERING ELECTIVE-I",
        Credit: "2",
        SUBCODE: null,
         Grade:"O",
      },
      {
        name: "HASS Elective - I",
        Credit: "2",
        SUBCODE: null,
         Grade:"O",
      },
    ],
    2: [
      {
        name: "PHYSICS",
        Credit: "3",
        SUBCODE: "PH10001",
         Grade:"O",
      },
      {
        name: "Differential Equations and Linear Algebra",
        Credit: "4",
        SUBCODE: "MA11001",
         Grade:"O",
      },
      {
        name: "SCIENCE OF LIVING SYSTEMS",
        Credit: "2",
        SUBCODE: "LS10001",
         Grade:"O",
      },
      {
        name: "ENVIROMENTAL SCIENCE",
        Credit: "2",
        SUBCODE: "CH10003",
         Grade:"O",
      },
      {
        name: "PHYSICS LAB",
        Credit: "1",
        SUBCODE: "PH19001",
         Grade:"O",
      },
      {
        name: "PROGRAMMING LAB",
        Credit: "4",
        SUBCODE: "CS19001",
         Grade:"O",
      },
      {
        name: "ENGINEERING DRAWING & GRAPHICS",
        Credit: "1",
        SUBCODE: "CE18001",
         Grade:"O",
      },
      {
        name: "ENGINEERING ELECTIVE-II",
        Credit: "2",
        SUBCODE: null,
         Grade:"O",
      },
      {
        name: "SCIENCE ELECTIVE",
        Credit: "2",
        SUBCODE: null,
         Grade:"O",
      },
    ],
    3: [
      {
        name: "DS",
        Credit: "4",
        SUBCODE: "CS21001",
         Grade:"O",
      },

      {
        name: "Scientific and Technical Writing",
        Credit: "2",
        SUBCODE: "EX20003",
         Grade:"O",
      },
      {
        name: "COA",
        Credit: "4",
        SUBCODE: "CS21002",
         Grade:"O",
      },
      {
        name: "Digital Systems Design",
        Credit: "3",
        SUBCODE: "EC20005",
         Grade:"O",
      },
      {
        name: "PS",
        Credit: "4",
        SUBCODE: "MA21001",
         Grade:"O",
      },
      {
        name: "OOPJ",
        Credit: "3",
        SUBCODE: "CS20004",
         Grade:"O",
      },
      {
        name: "DS LAB",
        Credit: "1",
        SUBCODE: "CS29001",
         Grade:"O",
      },
      {
        name: "OOPJ LAB",
        Credit: "1",
        SUBCODE: "CS29004",
         Grade:"O",
      },
      {
        name: "DSD LAB",
        Credit: "1",
        SUBCODE: "EC29005",
         Grade:"O",
      },
    ],
    4: [
      {
        name: "Industry 4.0 Technologies",
        Credit: "3",
        SUBCODE: "EX20001",
         Grade:"O",
      },
      {
        name: "Discrete Structures",
        Credit: "4",
        SUBCODE: "MA21002",
         Grade:"O",
      },
      {
        name: "OS",
        Credit: "3",
        SUBCODE: "CS20002",
         Grade:"O",
      },
      {
        name: "Engineering Economics",
        Credit: "3",
        SUBCODE: "HS30101",
         Grade:"O",
      },

      
      {
        name: "PDC",
        Credit: "4",
        SUBCODE: "EC20006",
         Grade:"O",
      },
      {
        name: "DBMS",
        Credit: "3",
        SUBCODE: "CS20006",
         Grade:"O",
      },
      
      {
        name: "OS LAB",
        Credit: "1",
        SUBCODE: "CS29002",
         Grade:"O",
      },
      {
        name: "DBMS LAB",
        Credit: "1",
        SUBCODE: "CS29006",
         Grade:"O",
      },
      {
        name: "Vocational Electives",
        Credit: "1",
        SUBCODE: "CS28001",
         Grade:"O",
      },
    ],
    5: [
      {
        name: "COMPUTER NETWORKS",
        Credit: "3",
        SUBCODE: "IT3005",
         Grade:"O",
      },
      {
        name: "IOT",
        Credit: "3",
        SUBCODE: "IT3007",
         Grade:"O",
      },
      {
        name: "Artificial Intelligence",
        Credit: "3",
        SUBCODE: "CS 3011",
         Grade:"O",
      },
      {
        name: "SOFTWARE ENGINEERING",
        Credit: "4",
        SUBCODE: "IT3003",
         Grade:"O",
      },
      {
        name: "NETWORK LAB",
        Credit: "1",
        SUBCODE: "IT3095",
         Grade:"O",
      },
      {
        name: "Advanced Programming LAB",
        Credit: "1",
        SUBCODE: "CS2098",
         Grade:"O",
      },
      {
        name: "ELECTIVE-1",
        Credit: "3",
        SUBCODE: null,
         Grade:"O",
      },
      {
        name: "ELECTIVE-2",
        Credit: "3",
        SUBCODE: null,
         Grade:"O",
      },
      
    ],
    6: [
      {
        name: "HASS Elective -III",
        Credit: "3",
        SUBCODE: "IT 3022",
         Grade:"O",
      },
      {
        name: "Compilers",
        Credit: "3",
        SUBCODE: "EC 3033 ",
         Grade:"O",
      },
      {
        name: "ARM and Advanced Microprocessors",
        Credit: "3",
        SUBCODE: null,
         Grade:"O",
      },{
        name: "Professional Elective-III",
        Credit: "3",
        SUBCODE: null,
         Grade:"O",
      },{
        name: "Open Elective –II / MI-I",
        Credit: "3",
        SUBCODE: null,
         Grade:"O",
      },
      
    
      {
        name: "Universal Human Values",
        Credit: "3",
        SUBCODE: null,
         Grade:"O",
      },
      {
        name: "ARM Laboratory",
        Credit: "1",
        SUBCODE: "IT3098",
         Grade:"O",
      },
      {
        name: "Advance Programming Laboratory",
        Credit: "2",
        SUBCODE: "CS3096",
         Grade:"O",
      },
      {
        name: "Mini Project",
        Credit: "2",
        SUBCODE: "CM3082",
         Grade:"O",
      },
     
    ],
    7: [
      {
        name: "HS-ELECTIVE-II",
        Credit: "3",
        SUBCODE: null,
         Grade:"O",
      },
      {
        name: "Professional Practice, Law & Ethics",
        Credit: "2",
        SUBCODE: "HS4001",
         Grade:"O",
      },
      {
        name: "OPEN ELECTIVE-II",
        Credit: "3",
        SUBCODE: "HS10001",
         Grade:"O",
      },
      {
        name: "MI-3",
        Credit: "3",
        SUBCODE: null,
         Grade:"O",
      },{
        name: "MI-4",
        Credit: "3",
        SUBCODE: null,
         Grade:"O",
      },{
        name: "HO-1",
        Credit: "3",
        SUBCODE: null,
         Grade:"O",
      },
      {
        name: "Project-1/Internship",
        Credit: "3",
        SUBCODE: "CM4081",
         Grade:"O",
      },
      {
        name: "Practical Training",
        Credit: "2",
        SUBCODE: "CM4083",
         Grade:"O",
      },
      {
        name: "Project-Minor/ LAB",
        Credit: "2",
        SUBCODE: null,
         Grade:"O",
      },
      
    ],
    "8": [
      {
        name: "SEMESTER-8",
        Credit: "3",
        SUBCODE: "CH10001",
         Grade:"O",
      },
      {
        name: "MATHEMATICS-II",
        Credit: "4",
        SUBCODE: "MA11002",
         Grade:"O",
      },
      {
        name: "ENGLISH",
        Credit: "2",
        SUBCODE: "HS10001",
         Grade:"O",
      },
      {
        name: "BASIC ELECTRONICS",
        Credit: "2",
        SUBCODE: "EC10001",
         Grade:"O",
      },
      {
        name: "CHEMISTRY LAB",
        Credit: "1",
        SUBCODE: "CH19001",
         Grade:"O",
      },
      {
        name: "YOGA",
        Credit: "1",
        SUBCODE: "YG18001",
         Grade:"O",
      },
      {
        name: "ENGINEERING LAB",
        Credit: "1",
        SUBCODE: "EX19001",
         Grade:"O",
      },
      {
        name: "WORKSHOP",
        Credit: "1",
        SUBCODE: "ME18001",
         Grade:"O",
      },
      {
        name: "COMMUNICATION LAB",
        Credit: "1",
        SUBCODE: "HS18001",
         Grade:"O",
      },
      {
        name: "ENGINEERING ELECTIVE-I",
        Credit: "2",
        SUBCODE: null,
         Grade:"O",
      },
      {
        name: "SOCIAL SCIENCE ELECTIVE",
        Credit: "2",
        SUBCODE: null,
         Grade:"O",
      },
    ],
  },


};

// Student Details Form Component - Moved outside to prevent recreation
const StudentDetailsForm = ({ 
  studentDetails, 
  setStudentDetails, 
  isStudentDetailsValid, 
  setShowStudentForm, 
  branches 
}: {
  studentDetails: StudentDetails;
  setStudentDetails: React.Dispatch<React.SetStateAction<StudentDetails>>;
  isStudentDetailsValid: boolean;
  setShowStudentForm: React.Dispatch<React.SetStateAction<boolean>>;
  branches: Record<string, string>;
}) => (
  <Card className="bg-gray-900/70 border-gray-800 backdrop-blur-sm">
    <CardHeader>
      <CardTitle className="text-white flex items-center gap-2">
        <GraduationCap className="w-5 h-5 text-blue-400" />
        Student Information
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="student-name" className="text-gray-300 text-sm mb-2 block">Full Name *</Label>
          <Input
            id="student-name"
            placeholder="Enter your full name"
            value={studentDetails.name}
            onChange={(e) => setStudentDetails(prev => ({ ...prev, name: e.target.value }))}
            className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
          />
        </div>
        <div>
          <Label htmlFor="student-roll" className="text-gray-300 text-sm mb-2 block">Roll Number *</Label>
          <Input
            id="student-roll"
            placeholder="Enter your roll number"
            value={studentDetails.rollNumber}
            onChange={(e) => setStudentDetails(prev => ({ ...prev, rollNumber: e.target.value }))}
            className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
          />
        </div>
        <div>
          <Label htmlFor="student-branch" className="text-gray-300 text-sm mb-2 block">Branch *</Label>
          <Select
            value={studentDetails.branch}
            onValueChange={(value) => setStudentDetails(prev => ({ ...prev, branch: value }))}
          >
            <SelectTrigger id="student-branch" className="bg-gray-800 border-gray-600 text-white focus:border-blue-500">
              <SelectValue placeholder="Select your branch" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              {Object.entries(branches).map(([key, name]) => (
                <SelectItem key={key} value={name} className="text-white hover:bg-gray-700">
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="student-year" className="text-gray-300 text-sm mb-2 block">Year *</Label>
          <Select
            value={studentDetails.year}
            onValueChange={(value) => setStudentDetails(prev => ({ ...prev, year: value }))}
          >
            <SelectTrigger id="student-year" className="bg-gray-800 border-gray-600 text-white focus:border-blue-500">
              <SelectValue placeholder="Select your year" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              {['1st Year', '2nd Year', '3rd Year', '4th Year'].map((year) => (
                <SelectItem key={year} value={year} className="text-white hover:bg-gray-700">
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="student-email" className="text-gray-300 text-sm mb-2 block">Email *</Label>
          <Input
            id="student-email"
            type="email"
            placeholder="Enter your email"
            value={studentDetails.email}
            onChange={(e) => setStudentDetails(prev => ({ ...prev, email: e.target.value }))}
            className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
          />
        </div>
        <div>
          <Label htmlFor="student-phone" className="text-gray-300 text-sm mb-2 block">Phone Number *</Label>
          <Input
            id="student-phone"
            type="tel"
            placeholder="Enter your phone number"
            value={studentDetails.phone}
            onChange={(e) => setStudentDetails(prev => ({ ...prev, phone: e.target.value }))}
            className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
          />
        </div>
      </div>
      
      <div className="flex justify-between items-center pt-4">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isStudentDetailsValid ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm text-gray-400">
            {isStudentDetailsValid ? 'All details completed' : 'Please fill all required fields'}
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowStudentForm(false)}
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (isStudentDetailsValid) {
                setShowStudentForm(false);
                toast.success('Student details saved successfully!');
              } else {
                toast.error('Please fill all required fields');
              }
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={!isStudentDetailsValid}
          >
            Save Details
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function AdvancedCGPACalculator() {
  // Student Details State
  const [studentDetails, setStudentDetails] = useState<StudentDetails>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('studentDetails');
      if (saved) return JSON.parse(saved);
    }
    return {
      name: '',
      rollNumber: '',
      branch: '',
      email: '',
      phone: '',
      year: ''
    };
  });
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

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
  const [cgpaSemesters, setCgpaSemesters] = useState<CGPASemester[]>([]);
  const [cgpaResult, setCgpaResult] = useState(0);
  const [cgpaSelectedBranch, setCgpaSelectedBranch] = useState<keyof typeof branchSubjects>('CSE');

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

  // Persist Student Details
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('studentDetails', JSON.stringify(studentDetails));
    }
  }, [studentDetails]);

  // Validate Student Details
  const isStudentDetailsValid = useMemo(() => {
    return studentDetails.name.trim() !== '' && 
           studentDetails.rollNumber.trim() !== '' && 
           studentDetails.branch.trim() !== '' && 
           studentDetails.email.trim() !== '' &&
           studentDetails.phone.trim() !== '' &&
           studentDetails.year.trim() !== '';
  }, [studentDetails]);



  // Persist SGPA Calculator State
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sgpaCalculatorState', JSON.stringify(sgpaCalculatorState));
    }
  }, [sgpaCalculatorState]);

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
      const initializedSubjects = semesterSubjects.map((subject: any, index) => ({
        id: `${sgpaCalculatorState.selectedSemester}-${index}`,
        name: subject.name,
        credits: Number(subject.credits || subject.Credit || 0),
        grade: 'O',
        gradePoints: 10
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
      const subjects = branchSubjects[selectedBranch][semesterNum as keyof typeof branchSubjects[typeof selectedBranch]] || [];
      
      return {
        id: semesterNum.toString(),
        name: `Semester ${semesterNum}`,
        subjects: subjects.map((subject: any, subIndex) => ({
          id: `${semesterNum}-${subIndex}`,
          name: subject.name,
          credits: Number(subject.credits || subject.Credit || 0),
          grade: 'O',
          gradePoints: 10
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
    const semesterNumber = cgpaSemesters.length + 1;
    
    // Calculate total credits for the selected branch and semester
    const semesterSubjects = branchSubjects[cgpaSelectedBranch][semesterNumber as keyof typeof branchSubjects[typeof cgpaSelectedBranch]] || [];
    const totalCredits = semesterSubjects.reduce((sum: number, subject: any) => {
      return sum + Number(subject.credits || subject.Credit || 0);
    }, 0);
    
    const newSemester: CGPASemester = {
      id: Date.now().toString(),
      name: `Semester ${semesterNumber}`,
      sgpa: 0,
      credits: totalCredits || 20 // fallback to 20 if no subjects found
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
      'O': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      'E': 'bg-green-500/20 text-green-400 border-green-500/30',
      'A': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'B': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      'C': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
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
    // Show celebration animation
    setShowCelebration(true);
    
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

    // Use actual student details from state
    const studentInfo = {
      name: studentDetails.name,
      roll: studentDetails.rollNumber,
      branch: studentDetails.branch,
      semester: type === 'sgpa' ? data.semester : (type === 'aggregate' ? `${data.fromSemester} - ${data.toSemester}` : 'All'),
      email: studentDetails.email,
    };

    pdf.setFontSize(13);
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Student Details', 25, yPosition + 9);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);
    pdf.setTextColor(200, 200, 200);
    // Row 1: Name | Roll No
    pdf.text('Name:', 25, yPosition + 18);
    pdf.text('Roll No:', 110, yPosition + 18);
    pdf.setTextColor(59, 130, 246);
    pdf.text(studentInfo.name, 25 + 15, yPosition + 18);
    pdf.text(studentInfo.roll, 110 + 15, yPosition + 18);
    pdf.setTextColor(200, 200, 200);
    // Row 2: Branch | Semester
    pdf.text('Branch:', 25, yPosition + 26);
    pdf.text('Semester:', 110, yPosition + 26);
    pdf.setTextColor(59, 130, 246);
    pdf.text(studentInfo.branch, 25 + 15, yPosition + 26);
    pdf.text(String(studentInfo.semester), 110 + 22, yPosition + 26);
    pdf.setTextColor(200, 200, 200);
    // Row 3: Email (spans width)
    pdf.text('Email:', 25, yPosition + 34);
    pdf.setTextColor(59, 130, 246);
    pdf.text(studentInfo.email, 25 + 15, yPosition + 34);

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
            'O': [16, 185, 129], 'E': [34, 197, 94], 'A': [59, 130, 246],
            'B': [6, 182, 212], 'C': [245, 158, 11], 'D': [249, 115, 22],
            'F': [239, 68, 68]
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
              'O': [16, 185, 129], 'E': [34, 197, 94], 'A': [59, 130, 246],
              'B': [6, 182, 212], 'C': [245, 158, 11], 'D': [249, 115, 22],
              'F': [239, 68, 68]
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
    
    // Hide celebration animation after 3 seconds
    setTimeout(() => {
      setShowCelebration(false);
    }, 3000);
  };

  const getBranchIcon = (branch: keyof typeof branches, color: string = "text-white") => {
    const icons = {
      'CSE': <Code className={`w-5 h-5 ${color}`} />,
      'CSSE': <Cpu className={`w-5 h-5 ${color}`} />,
      'CSCE': <Zap className={`w-5 h-5 ${color}`} />,
      'IT': <Database className={`w-5 h-5 ${color}`} />
    };
    return icons[branch];
  };



  // Celebration Animation Component
  const CelebrationAnimation = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-gradient-to-r from-green-500 to-blue-500 p-8 rounded-2xl text-center text-white animate-pulse">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-bold mb-2">Congratulations!</h2>
        <p className="text-xl">Your PDF report has been generated successfully!</p>
        <div className="mt-4 text-sm opacity-80">Report downloaded to your device</div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-4">
      {showCelebration && <CelebrationAnimation />}
      
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

        {/* Student Details Section */}
        {!isStudentDetailsValid && !showStudentForm && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2 text-red-400">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span>Student information required to proceed</span>
              </div>
            </div>
            <Card className="bg-gray-900/70 border-gray-800 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <GraduationCap className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                  <h3 className="text-xl font-semibold text-white mb-2">Complete Your Profile</h3>
                  <p className="text-gray-400">Please provide your student details to access the calculators</p>
                </div>
                <Button
                  onClick={() => setShowStudentForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Enter Student Details
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Student Details Form - Always show when showStudentForm is true */}
        {showStudentForm && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-lg px-4 py-2 text-blue-400">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Please fill in your student details</span>
              </div>
            </div>
            <StudentDetailsForm 
              studentDetails={studentDetails}
              setStudentDetails={setStudentDetails}
              isStudentDetailsValid={isStudentDetailsValid}
              setShowStudentForm={setShowStudentForm}
              branches={branches}
            />
          </div>
        )}

        {/* Student Info Display - Only show when form is not being shown */}
        {isStudentDetailsValid && !showStudentForm && (
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <div>
                    <p className="text-white font-medium">{studentDetails.name}</p>
                    <p className="text-gray-400 text-sm">{studentDetails.rollNumber} • {studentDetails.branch}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowStudentForm(true)}
                  className="border-gray-600 text-gray-300 bg-gray-800 hover:bg-cyan-700 hover:text-white"
                >
                  Edit Details
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Calculator Section */}
        <section aria-label="Academic Calculator Tools" className={!isStudentDetailsValid ? 'opacity-50 pointer-events-none' : ''}>
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
                                    {getBranchIcon(key as keyof typeof branches, selectedBranch === key ? "text-white" : "text-gray-600")}
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
                  {/* Branch Selection for CGPA */}
                  <Card className="bg-gray-900/70 border-gray-800 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Target className="w-5 h-5 text-purple-400" aria-hidden="true" />
                        Branch Selection for Credit Calculation
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div>
                        <Label htmlFor="cgpa-branch-select" className="text-gray-300 text-sm mb-2 block">Select Branch</Label>
                        <Select
                          value={cgpaSelectedBranch}
                          onValueChange={(value) => setCgpaSelectedBranch(value as keyof typeof branchSubjects)}
                        >
                          <SelectTrigger id="cgpa-branch-select" className="bg-gray-800 border-gray-600 text-white focus:border-purple-500">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-600">
                            {Object.entries(branches).map(([key, name]) => (
                              <SelectItem key={key} value={key} className="text-white hover:bg-gray-700">
                                <div className="flex items-center gap-2">
                                  {getBranchIcon(key as keyof typeof branches, "text-white")}
                                  <div>
                                    <p className="font-medium">{key}</p>
                                    <p className="text-xs text-gray-400">{name}</p>
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-gray-400 text-xs mt-2">
                          Select your branch to automatically calculate credits when adding semesters
                        </p>
                      </div>
                    </CardContent>
                  </Card>

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
                              : 'border-gray-600 text-gray-300 hover:bg-cyan-700 bg-gray-800 hover:text-white'
                          }`}
                        >
                          <div className="p-2 bg-green-500/20 rounded-lg">
                            {getBranchIcon(key as keyof typeof branches, selectedBranch === key ? "text-white" : "text-gray-600")}
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
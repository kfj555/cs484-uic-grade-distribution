import { create } from "zustand";
import { termOptions } from "./types";

interface storeType {
  year: number;
  term: termOptions;
  department: string;
  subj: string;
  courseNumber: string;
  departments: { dept_name: string; subj_cd: string }[];
  years: number[];
  terms: termOptions[];
  courseNumbers: string[];

  setYear: (year: number) => void;
  setTerm: (term: termOptions) => void;
  setDepartment: (department: string) => void;
  setCourseNumber: (courseNumber: string) => void;
  setSubj: (subj: string) => void;

  setYears: (years: number[]) => void;
  setTerms: (terms: termOptions[]) => void;
  setCourseNumbers: (courseNumbers: string[]) => void;
  setDepartments: (
    departments: { dept_name: string; subj_cd: string }[]
  ) => void;
}

export const useStore = create<storeType>((set) => ({
  year: 0,
  term: "",
  department: "",
  courseNumber: "",
  subj: "",

  departments: [],
  years: [],
  terms: [],
  courseNumbers: [],

  setYear: (year) =>
    set((state) => ({
      ...state,
      year: year,
    })),
  setTerm: (term) =>
    set((state) => ({
      ...state,
      term: term,
    })),
  setDepartment: (department) =>
    set((state) => ({
      ...state,
      department: department,
    })),
  setCourseNumber: (courseNumber) =>
    set((state) => ({
      ...state,
      courseNumber: courseNumber,
    })),
  setSubj: (subj) =>
    set((state) => ({
      ...state,
      subj: subj,
    })),
  setDepartments: (departments) =>
    set((state) => ({
      ...state,
      departments: departments,
    })),
  setYears: (years) =>
    set((state) => ({
      ...state,
      years: years,
    })),
  setTerms: (terms) =>
    set((state) => ({
      ...state,
      terms: terms,
    })),
  setCourseNumbers: (courseNumbers) =>
    set((state) => ({
      ...state,
      courseNumbers: courseNumbers,
    })),
}));

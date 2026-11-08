import { allProgrammes } from "./timetableData";
import { ProgrammeSection } from "../types";

export interface BranchOption {
  id: string;
  name: string;
  shortName: string;
  sections: number[];
  isMultiSection: boolean;
}

export const BRANCH_OPTIONS: BranchOption[] = [
  {
    id: "aiml",
    name: "B.Tech AIML",
    shortName: "AIML",
    sections: [1, 2, 3, 4],
    isMultiSection: true,
  },
  {
    id: "dsai",
    name: "B.Tech DSAI",
    shortName: "DSAI",
    sections: [6],
    isMultiSection: false,
  },
  {
    id: "aiml-dsai",
    name: "B.Tech AIML + DSAI",
    shortName: "AIML + DSAI",
    sections: [5],
    isMultiSection: false,
  },
  {
    id: "cyber",
    name: "B.Tech Cyber Security, Cloud & DevOps",
    shortName: "Cyber Security & Cloud",
    sections: [7],
    isMultiSection: false,
  },
  {
    id: "cse-core",
    name: "B.Tech CSE Core",
    shortName: "CSE Core",
    sections: [8, 9, 10],
    isMultiSection: true,
  },
  {
    id: "bme",
    name: "B.Tech BME",
    shortName: "BME",
    sections: [11],
    isMultiSection: false,
  },
  {
    id: "core-all",
    name: "B.Tech CE / ME / EEE / ECE / Robotics",
    shortName: "CE / ME / EEE / ECE / Robotics",
    sections: [12],
    isMultiSection: false,
  },
];

export interface SectionMetadata {
  sectionNumber: number;
  programme: string;
  room: string;
  classInCharge: string;
}

export const SECTION_METADATA_MAP: Record<number, SectionMetadata> = {
  1: { sectionNumber: 1, programme: "AIML", room: "EB-101", classInCharge: "Dr. Bhuvnesh" },
  2: { sectionNumber: 2, programme: "AIML", room: "EB-102", classInCharge: "Dr. Deepak Grover" },
  3: { sectionNumber: 3, programme: "AIML", room: "EB-103", classInCharge: "Dr. Bhuvaneswari" },
  4: { sectionNumber: 4, programme: "AIML", room: "EB-104", classInCharge: "Mr. S Murali" },
  5: { sectionNumber: 5, programme: "AIML + DSAI", room: "EB-105", classInCharge: "Mr. Ankit Mani Tripathi" },
  6: { sectionNumber: 6, programme: "DSAI", room: "EB-201", classInCharge: "Dr. Aasim" },
  7: { sectionNumber: 7, programme: "Cyber Security, Cloud & DevOps", room: "EB-202", classInCharge: "Dr. Ritika Nagpal" },
  8: { sectionNumber: 8, programme: "CSE Core", room: "EB-203", classInCharge: "Dr. Sonal" },
  9: { sectionNumber: 9, programme: "CSE Core", room: "EB-204", classInCharge: "Dr. Nagesha" },
  10: { sectionNumber: 10, programme: "CSE Core", room: "EB-205", classInCharge: "Ms. Ridhi Jain" },
  11: { sectionNumber: 11, programme: "BME", room: "EB-213", classInCharge: "Dr. Hemant" },
  12: { sectionNumber: 12, programme: "CE, ME, EEE, ECE, Robotics", room: "EB-216", classInCharge: "Mr. P Arun" },
};

/**
 * Get ProgrammeSection object for a section number (1-12)
 */
export function getProgrammeSectionByNumber(sectionNumber: number): ProgrammeSection | undefined {
  return allProgrammes.find((p) => p.sectionNumber === sectionNumber);
}

/**
 * Resolve Section Number from Branch and optional Section Number
 */
export function resolveSection(
  branchInput: string,
  sectionNum?: number
): { sectionNumber: number; section: ProgrammeSection } | null {
  const normBranch = branchInput.trim().toLowerCase();

  // Find matching branch
  const match = BRANCH_OPTIONS.find((b, idx) => {
    const numMatch = normBranch === String(idx + 1);
    const idMatch = normBranch.includes(b.id);
    const nameMatch = normBranch.includes(b.name.toLowerCase());
    const shortMatch = normBranch.includes(b.shortName.toLowerCase());
    return numMatch || idMatch || nameMatch || shortMatch;
  });

  if (!match) return null;

  let finalSecNum: number | undefined;

  if (match.isMultiSection) {
    if (sectionNum && match.sections.includes(sectionNum)) {
      finalSecNum = sectionNum;
    } else {
      return null; // needs section number
    }
  } else {
    finalSecNum = match.sections[0];
  }

  const sec = getProgrammeSectionByNumber(finalSecNum);
  if (!sec) return null;

  return {
    sectionNumber: finalSecNum,
    section: sec,
  };
}

/**
 * Parses user message during onboarding
 */
export function parseOnboardingResponse(
  message: string,
  pendingBranch?: BranchOption
): {
  action: "selected_branch_needs_section" | "resolved_section" | "unknown";
  branch?: BranchOption;
  resolvedSectionNumber?: number;
  resolvedSection?: ProgrammeSection;
} {
  const text = message.trim().toLowerCase();

  // If we already know the branch and are waiting for section number
  if (pendingBranch && pendingBranch.isMultiSection) {
    // Check for section numbers:
    // e.g. "section 1", "sec 1", "1", "2", "8", "9", "10"
    for (const secNum of pendingBranch.sections) {
      const regex = new RegExp(`\\b(section\\s*|sec\\s*)?${secNum}\\b`, "i");
      if (regex.test(text)) {
        const sec = getProgrammeSectionByNumber(secNum);
        if (sec) {
          return {
            action: "resolved_section",
            branch: pendingBranch,
            resolvedSectionNumber: secNum,
            resolvedSection: sec,
          };
        }
      }
    }
  }

  // Check if user replied with both branch and section in one line
  // e.g. "CSE Core Section 9" or "AIML section 2" or "I am in section 8"
  for (const [secNumStr, meta] of Object.entries(SECTION_METADATA_MAP)) {
    const secNum = Number(secNumStr);
    const exactSecRegex = new RegExp(`\\b(section\\s*|sec\\s*)?${secNum}\\b`, "i");
    if (
      exactSecRegex.test(text) &&
      (text.includes(meta.programme.toLowerCase()) || text.includes(meta.classInCharge.toLowerCase()) || text.includes(meta.room.toLowerCase()))
    ) {
      const sec = getProgrammeSectionByNumber(secNum);
      if (sec) {
        return {
          action: "resolved_section",
          resolvedSectionNumber: secNum,
          resolvedSection: sec,
        };
      }
    }
  }

  // Check if user answered option number 1 to 7 or branch name
  for (let idx = 0; idx < BRANCH_OPTIONS.length; idx++) {
    const opt = BRANCH_OPTIONS[idx];
    const optionNum = idx + 1;

    // Check exact option number like "1", "Option 1", "2", or branch name
    const optionRegex = new RegExp(`^\\s*(option\\s*)?${optionNum}\\s*$|\\b${opt.name.toLowerCase()}\\b|\\b${opt.shortName.toLowerCase()}\\b`, "i");

    if (
      optionRegex.test(text) ||
      (optionNum === 1 && text.includes("aiml") && !text.includes("dsai")) ||
      (optionNum === 2 && text.includes("dsai") && !text.includes("aiml")) ||
      (optionNum === 3 && text.includes("aiml") && text.includes("dsai")) ||
      (optionNum === 4 && (text.includes("cyber") || text.includes("devops") || text.includes("cloud"))) ||
      (optionNum === 5 && (text.includes("cse core") || text.includes("core"))) ||
      (optionNum === 6 && text.includes("bme")) ||
      (optionNum === 7 && (text.includes("robotics") || text.includes("ece") || text.includes("eee") || text.includes("mechanical") || text.includes("civil")))
    ) {
      if (opt.isMultiSection) {
        // Also check if they already included the section number in this text
        for (const secNum of opt.sections) {
          const secRegex = new RegExp(`\\b(section\\s*|sec\\s*)?${secNum}\\b`, "i");
          if (secRegex.test(text)) {
            const sec = getProgrammeSectionByNumber(secNum);
            if (sec) {
              return {
                action: "resolved_section",
                branch: opt,
                resolvedSectionNumber: secNum,
                resolvedSection: sec,
              };
            }
          }
        }

        return {
          action: "selected_branch_needs_section",
          branch: opt,
        };
      } else {
        // Single section branch - directly resolve!
        const secNum = opt.sections[0];
        const sec = getProgrammeSectionByNumber(secNum);
        if (sec) {
          return {
            action: "resolved_section",
            branch: opt,
            resolvedSectionNumber: secNum,
            resolvedSection: sec,
          };
        }
      }
    }
  }

  return { action: "unknown" };
}

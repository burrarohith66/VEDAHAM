"use client"

import { Button } from "@/components/ui/button"

type ProfileStepProps = {
  data: {
    degree: string
    branch: string
    year_of_study: number | null
    graduation_year: number | null
  }
  userName?: string
  onChange: (field: string, value: string | number | null) => void
  onNext: () => void
}

const inputClass =
  "h-11 w-full rounded-xl border border-white/10 bg-black/40 px-3.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/60 focus:border-primary/60 focus:ring-2 focus:ring-primary/20"

const selectClass =
  "h-11 w-full rounded-xl border border-white/10 bg-black/40 px-3.5 text-sm text-foreground outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20 cursor-pointer"

export function ProfileStep({ data, userName, onChange, onNext }: ProfileStepProps) {
  const currentYear = new Date().getFullYear()
  const graduationYears = Array.from({ length: 8 }, (_, i) => currentYear + i - 1)

  const canContinue = Boolean(data.degree && data.branch && data.year_of_study && data.graduation_year)

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-primary-bright">
          Step 1 of 4 • Student Profile
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {userName ? `Welcome, ${userName}` : "Welcome to Vedaham"}
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          Let’s set up your learning workspace. This takes about 2–3 minutes and helps personalize your curriculum.
        </p>
      </div>

      <div className="space-y-4 pt-1">
        {/* Degree */}
        <div className="space-y-1.5">
          <label htmlFor="degree" className="text-sm font-medium text-foreground">
            Degree / Program <span className="text-primary">*</span>
          </label>
          <select
            id="degree"
            value={data.degree || ""}
            onChange={(e) => onChange("degree", e.target.value || "")}
            className={selectClass}
            required
          >
            <option value="" disabled className="bg-neutral-900 text-muted-foreground">
              Select your degree
            </option>
            <option value="B.Tech" className="bg-neutral-900 text-foreground">
              B.Tech / B.E. (Bachelor of Technology)
            </option>
            <option value="B.Sc" className="bg-neutral-900 text-foreground">
              B.Sc (Bachelor of Science)
            </option>
            <option value="BCA" className="bg-neutral-900 text-foreground">
              BCA (Bachelor of Computer Applications)
            </option>
            <option value="M.Tech" className="bg-neutral-900 text-foreground">
              M.Tech / M.E.
            </option>
            <option value="MCA" className="bg-neutral-900 text-foreground">
              MCA
            </option>
            <option value="Other" className="bg-neutral-900 text-foreground">
              Other Degree
            </option>
          </select>
        </div>

        {/* Branch */}
        <div className="space-y-1.5">
          <label htmlFor="branch" className="text-sm font-medium text-foreground">
            Branch / Major <span className="text-primary">*</span>
          </label>
          <select
            id="branch"
            value={data.branch || ""}
            onChange={(e) => onChange("branch", e.target.value || "")}
            className={selectClass}
            required
          >
            <option value="" disabled className="bg-neutral-900 text-muted-foreground">
              Select your branch
            </option>
            <option value="Computer Science and Engineering" className="bg-neutral-900 text-foreground">
              Computer Science and Engineering (CSE)
            </option>
            <option value="Information Technology" className="bg-neutral-900 text-foreground">
              Information Technology (IT)
            </option>
            <option value="Electronics and Communication Engineering" className="bg-neutral-900 text-foreground">
              Electronics & Communication (ECE)
            </option>
            <option value="Electrical and Electronics Engineering" className="bg-neutral-900 text-foreground">
              Electrical & Electronics (EEE)
            </option>
            <option value="Mechanical Engineering" className="bg-neutral-900 text-foreground">
              Mechanical Engineering
            </option>
            <option value="Civil Engineering" className="bg-neutral-900 text-foreground">
              Civil Engineering
            </option>
            <option value="Data Science & AI" className="bg-neutral-900 text-foreground">
              Data Science & Artificial Intelligence
            </option>
            <option value="Other" className="bg-neutral-900 text-foreground">
              Other Specialization
            </option>
          </select>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Year of Study */}
          <div className="space-y-1.5">
            <label htmlFor="year_of_study" className="text-sm font-medium text-foreground">
              Year of Study <span className="text-primary">*</span>
            </label>
            <select
              id="year_of_study"
              value={data.year_of_study ?? ""}
              onChange={(e) =>
                onChange("year_of_study", e.target.value ? parseInt(e.target.value, 10) : null)
              }
              className={selectClass}
              required
            >
              <option value="" disabled className="bg-neutral-900 text-muted-foreground">
                Select Year
              </option>
              <option value="1" className="bg-neutral-900 text-foreground">1st Year</option>
              <option value="2" className="bg-neutral-900 text-foreground">2nd Year</option>
              <option value="3" className="bg-neutral-900 text-foreground">3rd Year</option>
              <option value="4" className="bg-neutral-900 text-foreground">4th Year</option>
            </select>
          </div>

          {/* Graduation Year */}
          <div className="space-y-1.5">
            <label htmlFor="graduation_year" className="text-sm font-medium text-foreground">
              Expected Graduation <span className="text-primary">*</span>
            </label>
            <select
              id="graduation_year"
              value={data.graduation_year ?? ""}
              onChange={(e) =>
                onChange("graduation_year", e.target.value ? parseInt(e.target.value, 10) : null)
              }
              className={selectClass}
              required
            >
              <option value="" disabled className="bg-neutral-900 text-muted-foreground">
                Select Year
              </option>
              {graduationYears.map((yr) => (
                <option key={yr} value={yr} className="bg-neutral-900 text-foreground">
                  {yr}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-white/[0.08] flex justify-end">
        <Button
          type="button"
          size="lg"
          onClick={onNext}
          disabled={!canContinue}
          className="w-full sm:w-auto"
        >
          Continue to Academics →
        </Button>
      </div>
    </div>
  )
}

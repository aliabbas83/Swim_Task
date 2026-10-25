"use client";

import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LaneRope, Wave } from "@/components/ui/Decorations";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { StickyFooter } from "@/components/ui/StickyFooter";
import { AgeGroupsCard } from "../components/AgeGroupsCard";
import { ChildCountPicker } from "../components/ChildCountPicker";
import { CourseFactsCard } from "../components/CourseFactsCard";
import { DiscountTiers } from "../components/DiscountTiers";
import { SeasonBadge } from "../components/SeasonBadge";
import { PriceSummary } from "../components/Summary";
import { CLUB } from "../config";
import { formatChildCount } from "../lib/format";
import { describeDiscountTiers } from "../lib/pricing";
import { REGISTRATION_STEPS } from "../lib/steps";
import { useRegistration } from "../state/RegistrationProvider";
import styles from "./WelcomeScreen.module.css";

export function WelcomeScreen() {
  const { state, actions, price } = useRegistration();
  const childCount = state.children.length;
  const firstStep = REGISTRATION_STEPS[0];

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <Logo size={168} className={styles.logo} />
          <div className={styles.heroText}>
            <p className={styles.eyebrow}>{CLUB.tagline} &middot; Summer registration open</p>
            <h1 className={styles.heroTitle}>{CLUB.name}</h1>
            <p className={styles.heroLead}>
              Two-week swimming courses for boys and girls aged 6 to 18. Register your children in a few taps.
            </p>
            <div className={styles.heroBadges}>
              <SeasonBadge />
              <DiscountTiers />
            </div>
          </div>
        </div>
        <LaneRope className={styles.heroRope} />
        <Wave height={36} className={styles.heroWave} />
      </header>

      <main className={styles.welcomeMain}>
        <CourseFactsCard />
        <Card title="How many children?" description={describeDiscountTiers()}>
          <ChildCountPicker label="Children to register" value={childCount} onChange={actions.setChildCount} />
        </Card>
        <AgeGroupsCard />
      </main>

      <StickyFooter
        summary={<PriceSummary price={price} />}
        action={
          <Button
            href={firstStep.path}
            size="lg"
            fullWidth
            icon={<ArrowRightIcon size={20} />}
            iconPosition="end"
          >
            Register {formatChildCount(childCount)}
          </Button>
        }
      />
    </div>
  );
}

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import Onboarding from "react-native-onboarding-swiper";
import LottieView from "lottie-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Dot = ({ selected }) => (
  <View
    style={[
      styles.dot,
      selected && styles.dotSelected,
    ]}
  />
);

const SkipButton = ({ ...props }) => (
  <TouchableOpacity {...props} style={styles.skipButton}>
    <Text style={styles.skipLabel}>Skip</Text>
  </TouchableOpacity>
);

const NextButton = ({ ...props }) => (
  <TouchableOpacity {...props} style={[styles.ctaButton, styles.nextButton]}>
    <Text style={styles.ctaLabel}>Next</Text>
  </TouchableOpacity>
);

const DoneButton = ({ ...props }) => (
  <TouchableOpacity {...props} style={[styles.ctaButton, styles.doneButton]}>
    <Text style={styles.ctaLabel}>Get Started</Text>
  </TouchableOpacity>
);

const CameraPreviewMock = ({ width }) => {
  const cardHeight = width < 380 ? 250 : 310;
  return (
    <View style={[styles.cameraCard, { height: cardHeight }]}> 
      <View style={styles.cameraStatusPill}>
        <Text style={styles.cameraStatusText}>LIVE · Auto-detect</Text>
      </View>
      <View style={styles.cameraDocRow}>
        <View style={styles.cameraDocPrimary} />
        <View style={styles.cameraDocSecondary} />
      </View>
      <View style={styles.cameraControls}>
        <View style={styles.captureButton}> 
          <Text style={styles.captureLabel}>Capture</Text>
        </View>
        <View style={styles.uploadButton}>
          <Text style={styles.uploadLabel}>Upload</Text>
        </View>
      </View>
    </View>
  );
};

const RiskResultsMock = ({ width }) => {
  const cardHeight = width < 380 ? 260 : 320;
  return (
    <View style={[styles.resultsCard, { height: cardHeight }]}> 
      {["Termination fee", "Unlimited liability", "Auto-renew"].map((risk, index) => (
        <View key={risk} style={styles.riskRow}>
          <View style={styles.riskBadge}>
            <Text style={styles.riskBadgeText}>High</Text>
          </View>
          <View style={styles.riskCopy}>
            <Text style={styles.riskTitle}>{risk}</Text>
            <Text style={styles.riskDetail}>Clause {index + 7}.2 · Needs counsel review</Text>
          </View>
        </View>
      ))}
      <View style={styles.resultsFooter}>
        <Text style={styles.resultsScore}>3 blockers flagged</Text>
        <Text style={styles.resultsSubcopy}>See clause-by-clause detail →</Text>
      </View>
    </View>
  );
};

const PaymentSheetMock = ({ width }) => {
  const cardHeight = width < 380 ? 250 : 300;
  return (
    <View style={[styles.paymentCard, { height: cardHeight }]}> 
      <View style={styles.paymentHeader}>
        <Text style={styles.paymentTitle}>Pay $19 → Full report</Text>
        <Text style={styles.paymentSubtitle}>Own the PDF, Word export & redlines</Text>
      </View>
      <View style={styles.paymentSummary}>
        <Text style={styles.paymentLabel}>Scan plan</Text>
        <Text style={styles.paymentValue}>$19</Text>
      </View>
      <View style={styles.paymentSummary}>
        <Text style={styles.paymentLabel}>Unlimited Pro</Text>
        <Text style={styles.paymentValue}>$47 / mo</Text>
      </View>
      <View style={styles.applePayMock}>
        <Text style={styles.applePayText}> Pay · Stripe</Text>
      </View>
      <View style={styles.paymentCTA}>
        <Text style={styles.paymentCTAText}>Tap to unlock full report</Text>
      </View>
    </View>
  );
};

const App = () => {
  const { width } = useWindowDimensions();
  const [userName, setUserName] = useState("John");
  const [currentPage, setCurrentPage] = useState(0);
  const [hasFinished, setHasFinished] = useState(false);
  const [bootstrapped, setBootstrapped] = useState(false);
  const confettiRef = useRef(null);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const storedName = await AsyncStorage.getItem("user.name");
        if (storedName) {
          setUserName(storedName);
        }
        const onboarded = await AsyncStorage.getItem("onboarded_app");
        if (onboarded === "true") {
          setHasFinished(true);
        }
      } finally {
        setBootstrapped(true);
      }
    };
    bootstrap();
  }, []);

  useEffect(() => {
    if (currentPage === 1 && confettiRef.current) {
      confettiRef.current.reset();
      confettiRef.current.play();
    }
  }, [currentPage]);

  const handleComplete = useCallback(async () => {
    await AsyncStorage.setItem("onboarded_app", "true");
    setHasFinished(true);
  }, []);

  const greeting = useMemo(() => `Hey ${userName || "John"}!`, [userName]);

  const pages = useMemo(
    () => [
      {
        backgroundColor: "#F6F8F7",
        image: <CameraPreviewMock width={width} />,
        title: `${greeting}\nScan contracts anywhere`,
        subtitle: "Use your phone camera or gallery upload. Auto-straighten, auto-contrast, zero stress.",
      },
      {
        backgroundColor: "#F6F8F7",
        image: <RiskResultsMock width={width} />,
        title: "3 High risks caught!",
        subtitle: "Clause-specific redlines ready in seconds. LegalDeep AI flags the exact language to fix.",
      },
      {
        backgroundColor: "#F6F8F7",
        image: <PaymentSheetMock width={width} />,
        title: "Pay $19 → Full report",
        subtitle: "Unlock PDF reports, shareable summaries, and collaborate with counsel instantly.",
      },
    ],
    [width, greeting],
  );

  if (!bootstrapped) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#F6F8F7" />
      </SafeAreaView>
    );
  }

  if (hasFinished) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#F6F8F7" />
        <View style={styles.postOnboarding}>
          <Text style={styles.postTitle}>You are ready to scan.</Text>
          <Text style={styles.postSubtitle}>Flag stored: onboarded_app = true</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F6F8F7" />
      <View style={styles.container}>
        <Onboarding
          pages={pages}
          onSkip={handleComplete}
          onDone={handleComplete}
          SkipButtonComponent={SkipButton}
          NextButtonComponent={NextButton}
          DoneButtonComponent={DoneButton}
          DotComponent={Dot}
          onSlideChange={(index) => setCurrentPage(index)}
          bottomBarHighlight={false}
          transitionAnimationDuration={450}
          containerStyles={styles.onboardingContainer}
          titleStyles={styles.pageTitle}
          subTitleStyles={styles.pageSubtitle}
        />
        {currentPage === 1 && (
          <LottieView
            ref={confettiRef}
            source={require("./assets/legaldeep-confetti.json")}
            autoPlay
            loop={false}
            style={styles.confetti}
            resizeMode="cover"
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F6F8F7",
  },
  container: {
    flex: 1,
    backgroundColor: "#F6F8F7",
  },
  onboardingContainer: {
    paddingHorizontal: 24,
  },
  pageTitle: {
    fontSize: 30,
    lineHeight: 36,
    textAlign: "left",
    color: "#0F172A",
    fontWeight: "700",
  },
  pageSubtitle: {
    fontSize: 16,
    lineHeight: 22,
    color: "#475467",
    textAlign: "left",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    marginHorizontal: 4,
    backgroundColor: "#CBD5F5",
  },
  dotSelected: {
    width: 18,
    backgroundColor: "#10B981",
  },
  skipButton: {
    position: "absolute",
    top: 16,
    right: 24,
    padding: 8,
    zIndex: 10,
  },
  skipLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#94A3B8",
  },
  ctaButton: {
    width: 160,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  nextButton: {
    backgroundColor: "#10B981",
  },
  doneButton: {
    backgroundColor: "#0F172A",
  },
  ctaLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  cameraCard: {
    width: "100%",
    borderRadius: 32,
    backgroundColor: "#0F172A",
    padding: 20,
    justifyContent: "space-between",
  },
  cameraStatusPill: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(16,185,129,0.2)",
  },
  cameraStatusText: {
    color: "#6EE7B7",
    fontSize: 12,
    fontWeight: "600",
  },
  cameraDocRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cameraDocPrimary: {
    flex: 1,
    height: 150,
    borderRadius: 24,
    backgroundColor: "#1E293B",
    marginRight: 12,
  },
  cameraDocSecondary: {
    width: 70,
    height: 120,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  cameraControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  captureButton: {
    flex: 1,
    marginRight: 12,
    height: 52,
    borderRadius: 999,
    backgroundColor: "#10B981",
    alignItems: "center",
    justifyContent: "center",
  },
  captureLabel: {
    color: "#04150C",
    fontSize: 16,
    fontWeight: "700",
  },
  uploadButton: {
    width: 90,
    height: 52,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  uploadLabel: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  resultsCard: {
    width: "100%",
    borderRadius: 32,
    backgroundColor: "#FFFFFF",
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 16,
  },
  riskRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  riskBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(248,113,113,0.15)",
    marginRight: 12,
  },
  riskBadgeText: {
    color: "#DC2626",
    fontSize: 12,
    fontWeight: "700",
  },
  riskCopy: {
    flex: 1,
  },
  riskTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A",
  },
  riskDetail: {
    fontSize: 13,
    color: "#475467",
    marginTop: 2,
  },
  resultsFooter: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  resultsScore: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  resultsSubcopy: {
    fontSize: 13,
    color: "#0F172A",
  },
  paymentCard: {
    width: "100%",
    borderRadius: 32,
    backgroundColor: "#0F172A",
    padding: 22,
  },
  paymentHeader: {
    marginBottom: 16,
  },
  paymentTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  paymentSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.65)",
    marginTop: 4,
  },
  paymentSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  paymentLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
  },
  paymentValue: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  applePayMock: {
    marginTop: 12,
    borderRadius: 18,
    backgroundColor: "#111827",
    paddingVertical: 12,
    alignItems: "center",
  },
  applePayText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  paymentCTA: {
    marginTop: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    paddingVertical: 12,
    alignItems: "center",
  },
  paymentCTAText: {
    color: "#6EE7B7",
    fontSize: 14,
    fontWeight: "600",
  },
  confetti: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
  },
  postOnboarding: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  postTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 8,
  },
  postSubtitle: {
    fontSize: 14,
    color: "#475467",
  },
});

export default App;

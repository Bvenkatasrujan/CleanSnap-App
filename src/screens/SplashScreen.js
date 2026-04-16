import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ onFinish }) => {

  // Animation values
  const logoScale     = useRef(new Animated.Value(0)).current;
  const logoOpacity   = useRef(new Animated.Value(0)).current;
  const textOpacity   = useRef(new Animated.Value(0)).current;
  const textTranslate = useRef(new Animated.Value(30)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const dotsOpacity   = useRef(new Animated.Value(0)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;
  const ringScale1    = useRef(new Animated.Value(0)).current;
  const ringScale2    = useRef(new Animated.Value(0)).current;
  const ringOpacity1  = useRef(new Animated.Value(0)).current;
  const ringOpacity2  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([

      // Step 1 — rings expand
      Animated.parallel([
        Animated.timing(ringScale1, {
          toValue: 1, duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(ringOpacity1, {
          toValue: 0.3, duration: 600,
          useNativeDriver: true,
        }),
      ]),

      // Step 2 — logo pops in
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1, friction: 5, tension: 80,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1, duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(ringScale2, {
          toValue: 1, duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(ringOpacity2, {
          toValue: 0.15, duration: 500,
          useNativeDriver: true,
        }),
      ]),

      // Step 3 — app name slides up
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1, duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(textTranslate, {
          toValue: 0, duration: 500,
          useNativeDriver: true,
        }),
      ]),

      // Step 4 — tagline fades in
      Animated.timing(taglineOpacity, {
        toValue: 1, duration: 400,
        useNativeDriver: true,
      }),

      // Step 5 — loading dots
      Animated.timing(dotsOpacity, {
        toValue: 1, duration: 300,
        useNativeDriver: true,
      }),

      // Step 6 — hold for 1 second
      Animated.delay(1000),

      // Step 7 — whole screen fades out
      Animated.timing(screenOpacity, {
        toValue: 0, duration: 600,
        useNativeDriver: true,
      }),

    ]).start(() => {
      // ✅ Tell parent splash is done
      onFinish();
    });
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: screenOpacity }]}>

      {/* Background decorative rings */}
      <Animated.View style={[
        styles.ring, styles.ringOuter,
        { transform: [{ scale: ringScale1 }], opacity: ringOpacity1 }
      ]} />
      <Animated.View style={[
        styles.ring, styles.ringInner,
        { transform: [{ scale: ringScale2 }], opacity: ringOpacity2 }
      ]} />

      {/* Logo */}
      <Animated.View style={[
        styles.logoContainer,
        {
          transform: [{ scale: logoScale }],
          opacity: logoOpacity,
        }
      ]}>
        {/* Outer glow ring */}
        <View style={styles.logoRingOuter}>
          <View style={styles.logoRingInner}>
            <View style={styles.logoCircle}>

              {/* Shield shape */}
              <View style={styles.shield}>
                <Ionicons name="shield-checkmark" size={36} color="#DCFCE7" />
              </View>

              {/* Camera icon on top of shield */}
              <View style={styles.cameraIcon}>
                <Ionicons name="camera" size={22} color="#166534" />
              </View>

            </View>
          </View>
        </View>
      </Animated.View>

      {/* App name */}
      <Animated.View style={{
        opacity: textOpacity,
        transform: [{ translateY: textTranslate }],
        alignItems: 'center',
        marginTop: 28,
      }}>
        <Text style={styles.appName}>CleanSnap</Text>
        <Text style={styles.appNameAccent}>App</Text>
      </Animated.View>

      {/* Tagline */}
      <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
        Report · Track · Resolve
      </Animated.Text>

      {/* Loading dots */}
      <Animated.View style={[styles.dotsRow, { opacity: dotsOpacity }]}>
        <LoadingDots />
      </Animated.View>

      {/* Bottom branding */}
      <Animated.Text style={[styles.bottomText, { opacity: taglineOpacity }]}>
        Powered by CleanSnap
      </Animated.Text>

    </Animated.View>
  );
};

// ✅ Animated loading dots
const LoadingDots = () => {
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animate = (dot, delay) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1, duration: 400, useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0.3, duration: 400, useNativeDriver: true,
          }),
        ])
      ).start();
    };
    animate(dot1, 0);
    animate(dot2, 200);
    animate(dot3, 400);
  }, []);

  return (
    <View style={styles.dots}>
      {[dot1, dot2, dot3].map((dot, i) => (
        <Animated.View
          key={i}
          style={[styles.dot, { opacity: dot }]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Background rings
  ring: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: '#16A34A',
  },
  ringOuter: {
    width: width * 0.85,
    height: width * 0.85,
  },
  ringInner: {
    width: width * 0.65,
    height: width * 0.65,
  },

  // Logo
  logoRingOuter: {
    width: 148, height: 148, borderRadius: 74,
    borderWidth: 2, borderColor: '#86EFAC',
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  logoRingInner: {
    width: 128, height: 128, borderRadius: 64,
    borderWidth: 1.5, borderColor: '#86EFAC',
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCircle: {
    width: 108, height: 108, borderRadius: 54,
    backgroundColor: '#166534',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  shield: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIcon: {
    position: 'absolute',
    width: 40, height: 40,
    borderRadius: 20,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Text
  appName: {
    fontSize: 42,
    fontWeight: '800',
    color: '#166534',
    letterSpacing: -1,
  },
  appNameAccent: {
    fontSize: 22,
    fontWeight: '600',
    color: '#16A34A',
    letterSpacing: 8,
    marginTop: -8,
  },
  tagline: {
    fontSize: 14,
    color: '#6B7280',
    letterSpacing: 3,
    marginTop: 12,
    fontWeight: '500',
  },

  // Loading dots
  dotsRow: {
    marginTop: 48,
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  dot: {
    width: 8, height: 8,
    borderRadius: 4,
    backgroundColor: '#16A34A',
  },

  // Bottom
  bottomText: {
    position: 'absolute',
    bottom: 48,
    fontSize: 12,
    color: '#9CA3AF',
    letterSpacing: 1,
  },
});

export default SplashScreen;
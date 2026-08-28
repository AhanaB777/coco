import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

interface HealthResponse {
  status: string;
  service: string;
  timestamp: string;
}

export default function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8000";

    fetch(`${apiUrl}/health`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setHealth(data))
      .catch(() => setHealth(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.badge}>Coco · Patient App</Text>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>
        Cognitive games and memory assistance for elderly patients in North East
        India.
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#047857" style={styles.loader} />
      ) : health ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Backend connected</Text>
          <Text style={styles.cardText}>Service: {health.service}</Text>
          <Text style={styles.cardText}>Status: {health.status}</Text>
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Backend offline</Text>
          <Text style={styles.cardText}>
            Start the API with docker compose or pnpm dev:backend.
          </Text>
        </View>
      )}

      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecfdf5",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  badge: {
    fontSize: 12,
    fontWeight: "600",
    color: "#047857",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#064e3b",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#065f46",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },
  loader: {
    marginTop: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    width: "100%",
    maxWidth: 360,
    borderWidth: 1,
    borderColor: "#a7f3d0",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#064e3b",
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: "#047857",
    marginBottom: 4,
  },
});

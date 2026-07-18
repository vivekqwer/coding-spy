import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#0B0F17",
    color: "#F8FAFC",
    padding: 60,
    fontFamily: "Helvetica",
  },
  border: {
    borderWidth: 2,
    borderColor: "#22D3EE",
    padding: 40,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  eyebrow: { fontSize: 12, letterSpacing: 4, color: "#F59E0B", marginBottom: 16, textTransform: "uppercase" },
  title: { fontSize: 30, fontWeight: 700, marginBottom: 6 },
  sub: { fontSize: 14, color: "#94A3B8", marginBottom: 30 },
  name: { fontSize: 26, marginBottom: 10, color: "#22D3EE" },
  topic: { fontSize: 18, marginBottom: 30 },
  meta: { fontSize: 11, color: "#94A3B8", marginTop: 30 },
  code: { fontSize: 11, color: "#8B5CF6", marginTop: 6 },
});

export function CertificateDocument({
  agentName,
  topicTitle,
  issuedAt,
  code,
}: {
  agentName: string;
  topicTitle: string;
  issuedAt: string;
  code: string;
}) {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.border}>
          <Text style={styles.eyebrow}>Classified · Agent Certification</Text>
          <Text style={styles.title}>Coding Spy</Text>
          <Text style={styles.sub}>This certifies that</Text>
          <Text style={styles.name}>{agentName}</Text>
          <Text style={styles.sub}>has successfully decoded and mastered the case file</Text>
          <Text style={styles.topic}>{topicTitle}</Text>
          <Text style={styles.meta}>Issued {issuedAt}</Text>
          <Text style={styles.code}>Verification Code: {code}</Text>
        </View>
      </Page>
    </Document>
  );
}

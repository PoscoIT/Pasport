import axios from "axios";
import { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, useWindowDimensions,ActivityIndicator } from "react-native";

import { Text, Button } from "react-native-paper";
import { LineChart } from "react-native-gifted-charts";

import { t } from "i18next";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import { Card } from "react-native-paper";
import { REACT_APP_SECRET_KEY } from "@env";

const ChecklistDetails = ({ route }) => {
  const item = route.params;
  const [details, setDetails] = useState([]);
  const navigation = useNavigation();
  const [listData, setListData] = useState([]);
const [loading,setLoading] = useState(true)
 const url = "https://tstapp.poscoassan.com.tr:8443";
 //const url = "http://10.0.2.2:5506"
const { width } = useWindowDimensions();

const chartWidth = Math.max(width - 104, 180);

const chartData = details.map((item) => {
  const hasValue =
    item.value !== null &&
    item.value !== undefined &&
    String(item.value).trim() !== "";

  const value = Number(item.value);

  return {
    ...item,

    // X ekseni altında gösterilecek tarih
    label: item.CreatedAt
      ? moment(item.CreatedAt).format("DD.MM.YYYY")
      : String(item.label ?? "").replace(/\n/g, "."),

    // Noktanın üzerinde yalnızca ölçüm değeri
    dataPointText:
      hasValue && Number.isFinite(value)
        ? value.toLocaleString("tr-TR", {
            maximumFractionDigits: 2,
          })
        : "",
  };
});

const hasChart = chartData.length > 0;
const hasRecords = listData.length > 0;

  const getDetail = async () => {
    setLoading(true)
    await axios
      .get(
        `${url}/WorkOrder/MMS/GetCareSystemChecklistRecord/${item.uID}`,
        {
          headers: {
            "auth-token": REACT_APP_SECRET_KEY,
          },
        }
      )
      .then((res) => {
    
        if (res.data?.status === "Success") {
          const flatData = res.data.data.flat();

          // istediğin format
          const formatted = flatData
            .filter((item) => !isNaN(Number(item.Answer)))
            .map((item) => ({
              value: isNaN(item.Answer) ? 0 : Number(item.Answer),
              label: moment(item.CreatedAt).format("DD.MM.YYYY"),
            }));
          setListData(flatData.filter((item) => isNaN(Number(item.Answer))));

          setDetails(formatted);
        } else {
          setDetails([]);
        }
      })
      .catch((err) => {
        setDetails([]);
        alert(t("safetyControlScreen.errorMessage"));
      }).finally(()=>{
        setLoading(false)
      })
  };

  useEffect(() => {
    getDetail();
  }, []);

  if(loading){
    return <View style={{display:"flex",alignItems:"center",justifyContent:"center",alignSelf:"center"}}>
  <ActivityIndicator size="large" color="#9E9E9E" />
    </View>
  
  }

  return (
  <View style={styles.container}>
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.topBackRow}>
  <Button
    mode="text"
    icon="arrow-left"
    textColor="#0B337C"
    onPress={() => navigation.goBack()}
    style={styles.topBackButton}
    labelStyle={styles.topBackLabel}
  >
    {t("goBack")}
  </Button>
</View>
      <View style={styles.header}>
        <View style={styles.headerAccent} />

        <View style={styles.headerContent}>
          <Text style={styles.eyebrow}>CARESYSTEM</Text>
          <Text style={styles.pageTitle}>{t("careSystemChecklistDetails.controlDetail")}</Text>
          <Text style={styles.pageSubtitle}>
            {hasChart
              ? t("careSystemChecklistDetails.changeMeasurement")
              : t("careSystemChecklistDetails.historicalRecord")}
          </Text>
        </View>
      </View>

      {hasChart ? (
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <View style={styles.chartHeading}>
              <Text style={styles.sectionTitle}>{t("careSystemChecklistDetails.measurementHistory")}</Text>
              <Text style={styles.sectionSubtitle}>
                {t("careSystemChecklistDetails.measurementValuetoControlDate")}
              </Text>
            </View>

            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>
                {chartData.length} {t("careSystemChecklistDetails.measurement")}
              </Text>
            </View>
          </View>

          <View style={styles.legend}>
            <View style={styles.legendDot} />
            <Text style={styles.legendText}>{t("careSystemChecklistDetails.measurementValue")}</Text>
          </View>

          <View style={styles.chartArea}>
            <LineChart
              data={chartData}
              height={250}
              width={chartWidth}
              spacing={110}
              initialSpacing={45}
              endSpacing={55}
              color="#0B337C"
              thickness={3}
              areaChart
              startFillColor="#0B337C"
              endFillColor="#FFFFFF"
              startOpacity={0.16}
              endOpacity={0.02}
              dataPointsColor="#0B337C"
              dataPointsRadius={5}
              textColor="#0B337C"
              textFontSize={10}
              textShiftY={-14}
              noOfSections={5}
              rulesColor="#E8EDF4"
              rulesType="dashed"
              xAxisColor="#DCE4EF"
              yAxisColor="#FFFFFF"
              xAxisThickness={1}
              yAxisTextStyle={styles.yAxisText}
              xAxisLabelTextStyle={styles.xAxisText}
              xAxisLabelsHeight={40}
              hideRules={false}
              showVerticalLines={false}
              isAnimated
              animationDuration={650}
            />
          </View>

          <View style={styles.chartFooter}>
            <View style={styles.infoDot} />
            <Text style={styles.chartFooterText}>
            {t("careSystemChecklistDetails.otherMetrics")}
            </Text>
          </View>
        </View>
      ) : hasRecords ? (
        <View>
          <View style={styles.listHeader}>
            <Text style={styles.sectionTitle}>{t("careSystemChecklistDetails.controlHistory")}</Text>

            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>
                {listData.length} {t("careSystemChecklistDetails.record")}
              </Text>
            </View>
          </View>

          {listData.map((item, index) => {
            const answer = String(item.Answer ?? "").trim();
            const normalizedAnswer = answer.toUpperCase();

            const isOK = normalizedAnswer === "OK";
            const isNotOK = normalizedAnswer === "NOT OK";

            const date = item.CreatedAt
              ? moment(item.CreatedAt)
              : null;

            return (
              <View
                key={item.ID != null ? String(item.ID) : String(index)}
                style={styles.recordCard}
              >
                <View style={styles.recordHeader}>
                  <View style={styles.recordNumber}>
                    <Text style={styles.recordNumberText}>
                      {String(index + 1).padStart(2, "0")}
                    </Text>
                  </View>

                  <View style={styles.recordHeading}>
                    <Text style={styles.recordEyebrow}>
                      {t("careSystemChecklistDetails.controlPoint")}
                    </Text>

                    <Text style={styles.recordTitle}>
                      {item.CheckItem || t("careSystemChecklistDetails.controlRecord")}
                    </Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.recordDetails}>
                  <View style={styles.answerColumn}>
                    <Text style={styles.fieldLabel}>{t("careSystemChecklistDetails.answer")}</Text>

                    <View
                      style={[
                        styles.answerBadge,
                        isOK && styles.answerBadgeSuccess,
                        isNotOK && styles.answerBadgeDanger,
                      ]}
                    >
                      <Text
                        style={[
                          styles.answerText,
                          isOK && styles.answerTextSuccess,
                          isNotOK && styles.answerTextDanger,
                        ]}
                      >
                        {answer || "—"}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.dateColumn}>
                    <Text style={styles.fieldLabel}>{t("careSystemChecklistDetails.controlDate")}</Text>
                    <Text style={styles.dateText}>
                      {date?.isValid()
                        ? date.format("DD.MM.YYYY")
                        : "—"}
                    </Text>
                  </View>
                </View>

                {!!String(item.Description ?? "").trim() && (
                  <View style={styles.descriptionBox}>
                    <Text style={styles.descriptionLabel}>{t("careSystemChecklistDetails.description")}</Text>
                    <Text style={styles.descriptionText}>
                      {item.Description}
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      ) : (
        <View style={styles.emptyCard}>
          <View style={styles.emptyIcon}>
            <Text style={styles.emptyIconText}>—</Text>
          </View>

          <Text style={styles.emptyTitle}>{t("noDetails")}</Text>

          <Text style={styles.emptyDescription}>
            {t("careSystemChecklistDetails.noRecord")}
          </Text>

          <Button
            mode="contained"
            buttonColor="#0B337C"
            textColor="#FFFFFF"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            contentStyle={styles.backButtonContent}
          >
            {t("goBack")}
          </Button>
        </View>
      )}
    </ScrollView>
  </View>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F6FB",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 36,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  headerAccent: {
    width: 5,
    alignSelf: "stretch",
    borderRadius: 5,
    backgroundColor: "#0B337C",
    marginRight: 13,
  },
  headerContent: {
    flex: 1,
  },
  eyebrow: {
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: "700",
    color: "#70809A",
    marginBottom: 5,
  },
  pageTitle: {
    fontSize: 25,
    fontWeight: "800",
    color: "#14243F",
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: 13,
    lineHeight: 20,
    color: "#748198",
    marginTop: 6,
  },
  chartCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingTop: 20,
    paddingBottom: 16,
    borderWidth: 1,
    borderColor: "#E5EBF3",
    shadowColor: "#18345B",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
  },
  chartHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 18,
  },
  chartHeading: {
    flex: 1,
    paddingRight: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#172B4D",
  },
  sectionSubtitle: {
    fontSize: 12,
    lineHeight: 18,
    color: "#8290A5",
    marginTop: 5,
  },
  countBadge: {
    backgroundColor: "#EEF3FC",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#0B337C",
  },
  legend: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    marginTop: 18,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#0B337C",
    marginRight: 7,
  },
  legendText: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "500",
  },
  chartArea: {
    marginTop: 28,
    paddingLeft: 8,
    paddingRight: 8,
    overflow: "hidden",
  },
  yAxisText: {
    color: "#8794A8",
    fontSize: 10,
  },
xAxisText: {
  color: "#748198",
  fontSize: 10,
  lineHeight: 18,
  textAlign: "center",
  marginTop: -250,
},
  chartFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#F6F8FC",
  },
  infoDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#8AA4CF",
    marginRight: 9,
  },
  chartFooterText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 17,
    color: "#7C899E",
  },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  recordCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E5EBF3",
  },
  recordHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  recordNumber: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#EEF3FC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  recordNumberText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0B337C",
  },
  recordHeading: {
    flex: 1,
  },
  recordEyebrow: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.2,
    color: "#8A97AA",
    marginBottom: 5,
  },
  recordTitle: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "700",
    color: "#203453",
  },
  divider: {
    height: 1,
    backgroundColor: "#EDF1F7",
    marginVertical: 16,
  },
  recordDetails: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  answerColumn: {
    flex: 1,
    paddingRight: 12,
  },
  dateColumn: {
    flexShrink: 1,
    alignItems: "flex-end",
  },
  fieldLabel: {
    fontSize: 11,
    color: "#8A97AA",
    marginBottom: 7,
  },
  answerBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#EEF3FC",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  answerBadgeSuccess: {
    backgroundColor: "#E8F7EE",
  },
  answerBadgeDanger: {
    backgroundColor: "#FFF0EF",
  },
  answerText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0B337C",
  },
  answerTextSuccess: {
    color: "#20834C",
  },
  answerTextDanger: {
    color: "#C84943",
  },
  dateText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#40516C",
    marginTop: 6,
  },
  descriptionBox: {
    backgroundColor: "#F7F9FC",
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
  },
  descriptionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#6D7D94",
    marginBottom: 5,
  },
  descriptionText: {
    fontSize: 13,
    lineHeight: 20,
    color: "#566680",
  },
  topBackRow: {
  alignItems: "flex-start",
  marginBottom: 12,
},
topBackButton: {
  borderRadius: 12,
  backgroundColor: "#E8EEF8",
},
topBackLabel: {
  fontSize: 14,
  fontWeight: "700",
},
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 38,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5EBF3",
    marginTop: 18,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: "#EEF3FC",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  emptyIconText: {
    fontSize: 30,
    color: "#0B337C",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#203453",
    textAlign: "center",
  },
  emptyDescription: {
    fontSize: 13,
    lineHeight: 21,
    color: "#8290A5",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 24,
  },
  backButton: {
    borderRadius: 12,
    minWidth: 150,
  },
  backButtonContent: {
    paddingVertical: 5,
  },
});

export default ChecklistDetails;
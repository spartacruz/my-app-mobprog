import React from 'react';
import { ScrollView, StyleSheet, Text, View, Dimensions } from 'react-native';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  StackedBarChart,
} from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function DashboardScreen() {
  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(10, 126, 164, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
    propsForLabels: {
      fontFamily: 'Segoe UI',
    },
  };

  // 1. Line Chart Data (Tren USD ke IDR)
  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
    datasets: [
      {
        data: [15400, 15550, 15300, 15600, 15800, 16100],
        color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`, // Green
        strokeWidth: 2,
      },
    ],
    legend: ['Nilai Tukar USD ke IDR'],
  };

  // 2. Bar Chart Data (Progres Berat Badan)
  const barChartData = {
    labels: ['Mgg 1', 'Mgg 2', 'Mgg 3', 'Mgg 4'],
    datasets: [
      {
        data: [75, 74.5, 73.8, 73],
      },
    ],
  };

  // 3. Pie Chart Data (Pangsa Pasar Sepatu)
  const pieChartData = [
    {
      name: 'Nike',
      population: 45,
      color: '#3b82f6', // Blue
      legendFontColor: '#333',
      legendFontSize: 12,
      legendFontFamily: 'Segoe UI',
    },
    {
      name: 'Adidas',
      population: 30,
      color: '#f59e0b', // Amber
      legendFontColor: '#333',
      legendFontSize: 12,
      legendFontFamily: 'Segoe UI',
    },
    {
      name: 'Puma',
      population: 15,
      color: '#ef4444', // Red
      legendFontColor: '#333',
      legendFontSize: 12,
      legendFontFamily: 'Segoe UI',
    },
    {
      name: 'Lainnya',
      population: 10,
      color: '#6b7280', // Gray
      legendFontColor: '#333',
      legendFontSize: 12,
      legendFontFamily: 'Segoe UI',
    },
  ];

  // 4. Progress Ring Data (Target Harian)
  const progressChartData = {
    labels: ['Kalori', 'Langkah', 'Air'], // optional
    data: [0.75, 0.6, 0.9],
  };

  // 5. Stacked Bar Chart Data (Penjualan Kaos)
  const stackedBarChartData = {
    labels: ['Jan', 'Feb', 'Mar'],
    legend: ['Ukuran S', 'Ukuran M', 'Ukuran L'],
    data: [
      [20, 35, 15],
      [25, 40, 20],
      [30, 45, 25],
    ],
    barColors: ['#60a5fa', '#34d399', '#f87171'],
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.headerTitle}>Dasbor Data Analitik</Text>

      {/* Chart 1: Line Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Grafik Garis: Tren USD ke IDR</Text>
        <LineChart
          data={lineChartData}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chartStyle}
        />
      </View>

      {/* Chart 2: Bar Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Grafik Batang: Progres Berat Badan (kg)</Text>
        <BarChart
          data={barChartData}
          width={screenWidth - 40}
          height={220}
          yAxisLabel=""
          yAxisSuffix=" kg"
          chartConfig={{
            ...chartConfig,
            color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`, // Purple
          }}
          style={styles.chartStyle}
        />
      </View>

      {/* Chart 3: Pie Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Grafik Lingkaran: Pangsa Pasar Sepatu</Text>
        <PieChart
          data={pieChartData}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          accessor={"population"}
          backgroundColor={"transparent"}
          paddingLeft={"15"}
          style={styles.chartStyle}
        />
      </View>

      {/* Chart 4: Progress Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Cincin Progres: Target Harian</Text>
        <ProgressChart
          data={progressChartData}
          width={screenWidth - 40}
          height={220}
          strokeWidth={16}
          radius={32}
          chartConfig={{
            ...chartConfig,
            color: (opacity = 1) => `rgba(236, 72, 153, ${opacity})`, // Pink
          }}
          hideLegend={false}
          style={styles.chartStyle}
        />
      </View>

      {/* Chart 5: Stacked Bar Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Grafik Batang Bertumpuk: Penjualan Kaos</Text>
        <StackedBarChart
          data={stackedBarChartData}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          style={styles.chartStyle}
          hideLegend={false}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6', // Light gray background
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  chartContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4b5563',
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  chartStyle: {
    borderRadius: 12,
  },
});

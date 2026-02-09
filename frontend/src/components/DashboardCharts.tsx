import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface DashboardChartsProps {
  byCategory: Record<string, number>;
  byStatus: Record<string, number>;
  topAreas: Array<{ area: string; count: number }>;
}

const CATEGORY_COLORS = {
  Water: "#3b82f6",
  Roads: "#8b5cf6",
  Electricity: "#f59e0b",
  Health: "#ef4444",
  Sanitation: "#10b981",
  Welfare: "#06b6d4",
  Housing: "#f97316",
  Other: "#6b7280",
};

const STATUS_COLORS = {
  new: "#3b82f6",
  pending: "#f59e0b",
  verified: "#8b5cf6",
  in_progress: "#06b6d4",
  resolved: "#10b981",
  closed: "#6b7280",
};

export function DashboardCharts({ byCategory, byStatus, topAreas }: DashboardChartsProps) {
  // Prepare category data
  const categoryData = Object.entries(byCategory).map(([name, value]) => ({
    name,
    value,
    fill: CATEGORY_COLORS[name as keyof typeof CATEGORY_COLORS] || "#6b7280",
  }));

  // Prepare status data
  const statusData = Object.entries(byStatus).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    fill: STATUS_COLORS[name as keyof typeof STATUS_COLORS] || "#6b7280",
  }));

  // Prepare area data
  const areaData = topAreas.map((item) => ({
    name: item.area || "Unknown",
    complaints: item.count,
  }));

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
      {/* Category Distribution */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="text-lg">Complaints by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Status Distribution */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="text-lg">Complaints by Status</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Areas */}
      <Card className="col-span-1 lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-lg">Top Affected Areas</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={areaData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="complaints" fill="#3b82f6" name="Complaints" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
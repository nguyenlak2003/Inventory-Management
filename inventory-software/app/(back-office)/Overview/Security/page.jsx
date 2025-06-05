"use client";
import React, { useState, useEffect } from "react";
import StatsCard from "./StatsCard";
import SearchAndFilters from "./SearchAndFilters";
import AuditLogTable from "./AuditLogTable";
import Pagination from "./Pagination";
import LogDetailModal from "./LogDetailModal";
import SidebarMenu from "../SidebarMenu/SidebarMenu";

function SecurityAuditLog() {
  const [auditLogs, setAuditLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalActivities: 0,
    activeUsers: 0,
    securityAlerts: 0,
    failedLogins: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [activityFilter, setActivityFilter] = useState("");
  const [selectedRow, setSelectedRow] = useState(-1);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedLogEntry, setSelectedLogEntry] = useState(null);

  // Mock data for demonstration
  const mockAuditLogs = [
    {
      id: 1,
      timestamp: "2024-01-15 10:30:25",
      user: "john.doe@company.com",
      activity: "User Login",
      ipAddress: "192.168.1.100",
      status: "Success",
      details: "Successful login from desktop application",
    },
    {
      id: 2,
      timestamp: "2024-01-15 10:25:12",
      user: "jane.smith@company.com",
      activity: "Data Access",
      ipAddress: "192.168.1.101",
      status: "Success",
      details: "Accessed customer database",
    },
    {
      id: 3,
      timestamp: "2024-01-15 10:20:45",
      user: "admin@company.com",
      activity: "Settings Change",
      ipAddress: "192.168.1.102",
      status: "Success",
      details: "Updated security policy settings",
    },
    {
      id: 4,
      timestamp: "2024-01-15 10:15:33",
      user: "unknown",
      activity: "Failed Login",
      ipAddress: "203.0.113.45",
      status: "Failed",
      details: "Multiple failed login attempts detected",
    },
    {
      id: 5,
      timestamp: "2024-01-15 10:10:18",
      user: "bob.wilson@company.com",
      activity: "Security Event",
      ipAddress: "192.168.1.103",
      status: "Success",
      details: "Password changed successfully",
    },
  ];

  async function fetchAuditLogs() {
    try {
      setIsLoading(true);
      setError(null);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Filter logs based on search and activity filter
      let filteredLogs = mockAuditLogs;

      if (searchQuery) {
        filteredLogs = filteredLogs.filter((log) =>
          Object.values(log).some((value) =>
            value.toString().toLowerCase().includes(searchQuery.toLowerCase()),
          ),
        );
      }

      if (activityFilter) {
        filteredLogs = filteredLogs.filter((log) =>
          log.activity.toLowerCase().includes(activityFilter.toLowerCase()),
        );
      }

      // Simulate pagination
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

      setAuditLogs(paginatedLogs);
      setTotalPages(Math.ceil(filteredLogs.length / itemsPerPage));
      setStats({
        totalActivities: 1234,
        activeUsers: 156,
        securityAlerts: 12,
        failedLogins: 45,
      });
    } catch (err) {
      setError("Failed to load audit logs");
    } finally {
      setIsLoading(false);
    }
  }

  function handleNextPage() {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  }

  function handlePrevPage() {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  }

  function handleSearch(query) {
    setSearchQuery(query);
    setCurrentPage(1);
  }

  function handleFilterChange(filter) {
    setActivityFilter(filter);
    setCurrentPage(1);
  }

  function handleTableKeyNav(event, rowIndex, colIndex, numRows, numCols) {
    event.preventDefault();
    switch (event.key) {
      case "ArrowDown":
        if (rowIndex < numRows - 1) {
          setSelectedRow(rowIndex + 1);
        }
        break;
      case "ArrowUp":
        if (rowIndex > 0) {
          setSelectedRow(rowIndex - 1);
        }
        break;
      case "Enter":
        if (auditLogs[rowIndex]) {
          showLogDetails(auditLogs[rowIndex]);
        }
        break;
    }
  }

  function showLogDetails(log) {
    setSelectedLogEntry(log);
    setShowDetailModal(true);
  }

  function closeLogDetails() {
    setSelectedLogEntry(null);
    setShowDetailModal(false);
  }

  async function handleExport() {
    try {
      // Simulate export functionality
      const csvContent = [
        "Timestamp,User,Activity,IP Address,Status",
        ...auditLogs.map(
          (log) =>
            `${log.timestamp},${log.user},${log.activity},${log.ipAddress},${log.status}`,
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "audit-log-export.csv";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError("Failed to export audit logs");
    }
  }

  useEffect(() => {
    fetchAuditLogs();
  }, [currentPage, searchQuery, activityFilter]);

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <SidebarMenu />

      {/* Main Content */}
      <div className="flex-1">
        <header className="p-5 bg-black text-[white]">
          <div className="flex justify-between items-center mx-auto my-0 max-w-[1200px]">
            <h1 className="m-0 text-3xl">Security Audit Log</h1>
            <div className="flex gap-5">
              <button
                className="px-9 py-2.5 bg-red-600 rounded cursor-pointer border-[none] font-[bold] text-[white] hover:bg-red-700"
                onClick={handleExport}
              >
                Export Log
              </button>
            </div>
          </div>
        </header>

        <main className="px-5 py-0 mx-auto my-8 max-w-[1200px]">
          <section
            className="grid gap-5 mb-8 grid-cols-[repeat(4,1fr)]"
            aria-label="Audit statistics"
          >
            <StatsCard title="Total Activities" value="1,234" />
            <StatsCard title="Active Users" value="156" />
            <StatsCard title="Security Alerts" value="12" />
            <StatsCard title="Failed Logins" value="45" />
          </section>

          <SearchAndFilters
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
          />

          <AuditLogTable
            auditLogs={auditLogs}
            isLoading={isLoading}
            error={error}
            selectedRow={selectedRow}
            onShowDetails={showLogDetails}
            onTableKeyNav={handleTableKeyNav}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPrevPage={handlePrevPage}
            onNextPage={handleNextPage}
          />
        </main>

        <LogDetailModal
          isOpen={showDetailModal}
          logEntry={selectedLogEntry}
          onClose={closeLogDetails}
        />
      </div>
    </div>
  );
}

export default SecurityAuditLog;

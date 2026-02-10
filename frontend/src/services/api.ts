import { ComplaintFormData, ComplaintStatus, ComplaintSubmissionResult, DashboardStats, Complaint } from '@/lib/types';

export const API_BASE_URL = 'https://civisense-2-api.onrender.com';

export const API_ENDPOINTS = {
  complaint: `${API_BASE_URL}/complaint`,
  dashboard: `${API_BASE_URL}/dashboard`,
  updateStatus: (id: string) => `${API_BASE_URL}/status/${id}`,
} as const;

export const api = {
  submitComplaint: async (data: ComplaintFormData): Promise<ComplaintSubmissionResult> => {
    // Format the rich data into a single text block for the backend
    const formattedText = `
${data.description}

--- Additional Details ---
Service Type: ${data.serviceType}
Urgency: ${data.urgency}
Contact Name: ${data.name}
Phone: ${data.phone}
Email: ${data.email}
Vulnerability: 
  - Senior Citizen: ${data.vulnerability.seniorCitizen ? 'Yes' : 'No'}
  - Low Income: ${data.vulnerability.lowIncome ? 'Yes' : 'No'}
  - Disability: ${data.vulnerability.disability ? 'Yes' : 'No'}
Consent Given: ${data.consent ? 'Yes' : 'No'}
    `.trim();

    const response = await fetch(API_ENDPOINTS.complaint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: formattedText,
        area: data.area,
        status: 'new',
        vulnerability: data.vulnerability
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to submit complaint');
    }

    const dataOut = await response.json();

    // Map backend response to frontend equivalent
    return {
      referenceId: dataOut.id.toString(),
      category: dataOut.category,
      confidence: Math.round(dataOut.confidence * 100),
      priorityScore: Math.round(dataOut.priority_score * 100),
      suggestedScheme: dataOut.scheme,
      schemeExplanation: dataOut.explanation.scheme.notes,
      urgencyExplanation: dataOut.explanation.urgency.notes,
      nextSteps: [
        "Your complaint has been logged in the system.",
        "It will be reviewed by a municipal officer within 24 hours.",
        "You can track the status using your reference ID."
      ]
    };
  },

  getDashboard: async (): Promise<{
    recent_high_priority: Complaint[],
    stats: DashboardStats,
    by_category: Record<string, number>,
    by_status: Record<string, number>,
    top_areas: Array<{ area: string; count: number }>
  }> => {
    const response = await fetch(API_ENDPOINTS.dashboard);

    if (!response.ok) {
      throw new Error('Failed to fetch dashboard data');
    }

    const data = await response.json();
    console.log('Dashboard API Response:', data); // Debug log

    // Helper to parse the formatted text back into objects
    const parseComplaintText = (text: string) => {
      const parts = text.split('--- Additional Details ---');
      const description = parts[0].trim();
      let contactName = 'Anonymous';
      let phone = '';
      let email = '';
      let vulnerability = {
        seniorCitizen: false,
        lowIncome: false,
        disability: false
      };

      if (parts[1]) {
        const details = parts[1];

        const nameMatch = details.match(/Contact Name: (.*)/);
        if (nameMatch) contactName = nameMatch[1].trim();

        const phoneMatch = details.match(/Phone: (.*)/);
        if (phoneMatch) phone = phoneMatch[1].trim();

        const emailMatch = details.match(/Email: (.*)/);
        if (emailMatch) email = emailMatch[1].trim();

        // Vulnerability parsing
        vulnerability.seniorCitizen = details.includes('Senior Citizen: Yes');
        vulnerability.lowIncome = details.includes('Low Income: Yes');
        vulnerability.disability = details.includes('Disability: Yes');
      }

      return { description, contactName, phone, email, vulnerability };
    };

    // Map the complaints
    const mappedComplaints = data.recent_high_priority.map((c: any) => {
      const { description, contactName, phone, email, vulnerability } = parseComplaintText(c.text);

      // Determine priority label from score
      const priorityLabel = (c.priority_score >= 0.7) ? 'high' :
        (c.priority_score >= 0.4) ? 'medium' : 'low';

      // Construct explanation summary
      const explanation = `Priority Score: ${Math.round(c.priority_score * 100)}/100. Breakdown: Urgency (${c.urgency?.toFixed(2) || 0}), Impact (${c.population_impact?.toFixed(2) || 0}), Vulnerability (${c.vulnerability?.toFixed(2) || 0}).`;

      return {
        id: c.id.toString(),
        description: description,
        category: c.category || 'Uncategorized',
        priority: priorityLabel,
        scheme: c.scheme || 'Pending',
        area: c.area || 'Unknown',
        status: c.status,
        timestamp: c.timestamp,
        contact: {
          name: contactName,
          phone: phone || 'Not provided',
          email: email || 'Not provided'
        },
        vulnerability: vulnerability,
        // AI Metrics
        confidence: c.confidence,
        urgencyScore: c.urgency,
        impactScore: c.population_impact,
        vulnerabilityScore: c.vulnerability,
        explanation: explanation
      };
    });

    return {
      recent_high_priority: mappedComplaints,
      stats: {
        total: data.total_complaints,
        pending: (data.by_status['new'] || 0) + (data.by_status['assigned'] || 0) + (data.by_status['verified'] || 0) + (data.by_status['scheme_linked'] || 0),
        resolved: (data.by_status['resolved'] || 0) + (data.by_status['closed'] || 0),
        highPriority: mappedComplaints.filter((c: any) => c.priorityScore >= 70).length
      },
      by_category: data.by_category || {},
      by_status: data.by_status || {},
      top_areas: data.top_areas || []
    };
  },

  updateStatus: async (id: number, status: ComplaintStatus): Promise<any> => {
    const response = await fetch(API_ENDPOINTS.updateStatus(id.toString()), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error('Failed to update status');
    }

    return response.json();
  },

  sendFeedback: async (complaintId: string, correctCategory?: string, correctScheme?: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        complaint_id: parseInt(complaintId),
        correct_category: correctCategory,
        correct_scheme: correctScheme
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to submit feedback');
    }
  }
};
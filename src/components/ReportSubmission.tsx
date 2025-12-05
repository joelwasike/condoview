import { useState } from 'react';
import Modal from './ui/modal';
import { AlertTriangle, FileText, Upload, Send, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const ReportSubmission = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reportData, setReportData] = useState({
    type: '',
    priority: 'medium',
    subject: '',
    description: '',
    category: '',
    attachments: [] as File[],
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const reportTypes = [
    { value: 'complaint', label: 'Complaint' },
    { value: 'maintenance', label: 'Maintenance Request' },
    { value: 'payment', label: 'Payment Issue' },
    { value: 'noise', label: 'Noise Complaint' },
    { value: 'safety', label: 'Safety Concern' },
    { value: 'other', label: 'Other' },
  ];

  const categories = [
    { value: 'property', label: 'Property Related' },
    { value: 'neighbor', label: 'Neighbor Issue' },
    { value: 'management', label: 'Management Issue' },
    { value: 'facility', label: 'Facility/Common Area' },
    { value: 'emergency', label: 'Emergency' },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setReportData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...files],
    }));
  };

  const removeAttachment = (index: number) => {
    setReportData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reportData.type && reportData.subject && reportData.description) {
      console.log('Report submitted:', reportData);
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setIsModalOpen(false);
        setReportData({
          type: '',
          priority: 'medium',
          subject: '',
          description: '',
          category: '',
          attachments: [],
        });
      }, 3000);
    }
  };

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)} variant="outline">
        <AlertTriangle className="w-4 h-4 mr-2" />
        Submit Report
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Submit Report or Complaint"
        size="lg"
      >
        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Report Submitted Successfully!</h3>
            <p className="text-muted-foreground">
              Your report has been received and will be reviewed by our team. You will receive an
              update within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reportType">Report Type *</Label>
                <Select
                  value={reportData.type}
                  onValueChange={(value) => setReportData((prev) => ({ ...prev, type: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority Level</Label>
                <Select
                  value={reportData.priority}
                  onValueChange={(value) =>
                    setReportData((prev) => ({ ...prev, priority: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={reportData.category}
                onValueChange={(value) => setReportData((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                type="text"
                value={reportData.subject}
                onChange={(e) => setReportData((prev) => ({ ...prev, subject: e.target.value }))}
                placeholder="Brief description of the issue"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Detailed Description *</Label>
              <Textarea
                id="description"
                value={reportData.description}
                onChange={(e) =>
                  setReportData((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Please provide as much detail as possible..."
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="attachments">Attachments (Optional)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="attachments"
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  accept="image/*,.pdf,.doc,.docx"
                  className="hidden"
                />
                <Label
                  htmlFor="attachments"
                  className="cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Files
                </Label>
                <span className="text-sm text-muted-foreground">
                  Images, PDFs, or documents (max 10MB each)
                </span>
              </div>

              {reportData.attachments.length > 0 && (
                <div className="space-y-2 mt-2">
                  {reportData.attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttachment(index)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                <Send className="w-4 h-4 mr-2" />
                Submit Report
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
};

export default ReportSubmission;


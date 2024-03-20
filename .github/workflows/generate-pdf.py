import sys
import pdfkit

# Read input from standard input
data = sys.stdin.read()

# Format data
formatted_data = data.replace('\n', '<br>')

# Generate PDF
pdfkit.from_string(formatted_data, 'checklist.pdf')

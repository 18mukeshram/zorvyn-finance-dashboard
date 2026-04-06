/**
 * CSV export utility.
 * Converts transactions array to CSV and triggers browser download.
 */

/**
 * Export transactions to a downloadable CSV file.
 * @param {Array} transactions - Array of transaction objects
 * @param {string} [filename='transactions.csv'] - Output filename
 */
export function exportToCSV(transactions, filename = 'zorvyn-transactions.csv') {
  if (!transactions || transactions.length === 0) return

  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount']

  const rows = transactions.map((t) => [
    t.date,
    `"${t.description.replace(/"/g, '""')}"`, // Escape quotes in descriptions
    t.category,
    t.type,
    t.amount.toFixed(2),
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n')

  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.display = 'none'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  // Clean up the object URL
  URL.revokeObjectURL(url)
}

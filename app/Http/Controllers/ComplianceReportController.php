<?php

namespace App\Http\Controllers;

use App\Models\Delivery;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class ComplianceReportController extends Controller
{
    public function export(Delivery $delivery)
    {
        // Auth: admin OR officer who owns it
        $user = auth()->user();
        if ($user->role !== 'admin' && $delivery->requested_by !== $user->id) {
            abort(403, 'Unauthorized action.');
        }

        try {
            // Load relationships
            $delivery->load(['driver', 'officer', 'vehicle', 'chainOfCustody', 'environmentLog', 'checklist']);

            // Generate PDF from Blade view
            $pdf = Pdf::loadView('pdf.compliance-report', compact('delivery'));

            return $pdf->download('compliance-' . $delivery->id . '.pdf');
        } catch (\Exception $e) {
            \Log::error('PDF Export Error: ' . $e->getMessage());
            \Log::error($e->getTraceAsString());
            abort(500, 'Error generating PDF: ' . $e->getMessage());
        }
    }
}

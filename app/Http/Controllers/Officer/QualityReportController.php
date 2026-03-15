<?php

namespace App\Http\Controllers\Officer;

use App\Http\Controllers\Controller;
use App\Models\QualityReport;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QualityReportController extends Controller
{
    public function index(Request $request)
    {
        $query = QualityReport::with(['delivery', 'vehicle', 'creator'])
            ->where('created_by', auth()->id())
            ->orderByDesc('created_at');

        if ($request->filled('month_year')) {
            $query->where('month_year', $request->month_year);
        }

        $reports = $query->paginate(15)->withQueryString();

        return Inertia::render('Officer/QualityReports/Index', [
            'reports' => $reports,
            'filters' => $request->only(['month_year']),
        ]);
    }
}

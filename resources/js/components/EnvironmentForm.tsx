import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { showAlert } from '@/utils/alerts';

interface ExtraLog {
    temp: string;
    humidity: string;
    label?: string;
}

interface EnvironmentLog {
    id?: number;
    delivery_id: number;
    start_temp: string | number;
    start_humidity: string | number;
    mid_temp: string | number;
    mid_humidity: string | number;
    end_temp: string | number;
    end_humidity: string | number;
    extra_logs: ExtraLog[];
    corrective_action: string;
    updated_at: string;
}

interface EnvironmentLogFormProps {
    delivery: { id: number; [key: string]: any };
    envLog?: EnvironmentLog;
    readOnly?: boolean;
}

export default function EnvironmentForm({ delivery, envLog, readOnly = false }: EnvironmentLogFormProps) {
    const TEMP_MIN = 68;
    const TEMP_MAX = 76;
    const HUM_MIN = 30;
    const HUM_MAX = 60;

    const { data, setData, post, processing, errors } = useForm<any>({
        start_temp: envLog?.start_temp ?? '',
        start_humidity: envLog?.start_humidity ?? '',
        mid_temp: envLog?.mid_temp ?? '',
        mid_humidity: envLog?.mid_humidity ?? '',
        end_temp: envLog?.end_temp ?? '',
        end_humidity: envLog?.end_humidity ?? '',
        extra_logs: (envLog?.extra_logs ?? []) as ExtraLog[],
        corrective_action: envLog?.corrective_action ?? '',
    });

    const [hasExcursion, setHasExcursion] = useState(false);

    const checkRange = (temp: number | string, humidity: number | string) => {
        if (!temp && !humidity) return true; // not logged yet
        
        const tempVal = temp ? parseFloat(temp.toString()) : null;
        const humVal = humidity ? parseFloat(humidity.toString()) : null;

        if (tempVal !== null && (tempVal < TEMP_MIN || tempVal > TEMP_MAX)) return false;
        if (humVal !== null && (humVal < HUM_MIN || humVal > HUM_MAX)) return false;

        return true;
    };

    const statusObj = {
        start: checkRange(data.start_temp, data.start_humidity),
        mid: checkRange(data.mid_temp, data.mid_humidity),
        end: checkRange(data.end_temp, data.end_humidity),
    };

    useEffect(() => {
        const extraLogs = (data.extra_logs || []) as ExtraLog[];
        const extraExcursion = extraLogs.some(log => !checkRange(log.temp, log.humidity));
        const sOk = checkRange(data.start_temp, data.start_humidity);
        const mOk = checkRange(data.mid_temp, data.mid_humidity);
        const eOk = checkRange(data.end_temp, data.end_humidity);
        setHasExcursion(!sOk || !mOk || !eOk || extraExcursion);
    }, [data.start_temp, data.start_humidity, data.mid_temp, data.mid_humidity, data.end_temp, data.end_humidity, data.extra_logs]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('driver.envlog.store', delivery.id), { 
            preserveScroll: true,
            onSuccess: () => showAlert('Success', 'Environment logs saved successfully'),
        });
    };

    const addExtraLog = () => {
        const extraLogs = (data.extra_logs || []) as ExtraLog[];
        setData('extra_logs', [...extraLogs, { temp: '', humidity: '', label: `Reading #${extraLogs.length + 1}` }]);
    };

    const removeExtraLog = (index: number) => {
        const extraLogs = [...((data.extra_logs || []) as ExtraLog[])];
        extraLogs.splice(index, 1);
        setData('extra_logs', extraLogs);
    };

    const updateExtraLog = (index: number, field: keyof ExtraLog, value: string) => {
        const extraLogs = [...((data.extra_logs || []) as ExtraLog[])];
        extraLogs[index] = { ...extraLogs[index], [field]: value };
        setData('extra_logs', extraLogs);
    };

    const InputRow = ({ label, prefix, isExtra = false, index = -1 }: { label: string, prefix?: 'start' | 'mid' | 'end', isExtra?: boolean, index?: number }) => {
        let tempValue: any, humValue: any, isOk: boolean, isFilled: boolean;

        if (isExtra && index !== -1) {
            const extraLogs = (data.extra_logs || []) as ExtraLog[];
            tempValue = extraLogs[index].temp;
            humValue = extraLogs[index].humidity;
            isOk = checkRange(tempValue, humValue);
            isFilled = tempValue !== '' || humValue !== '';
        } else {
            tempValue = data[`${prefix}_temp` as keyof typeof data];
            humValue = data[`${prefix}_humidity` as keyof typeof data];
            isOk = statusObj[prefix as 'start' | 'mid' | 'end'];
            isFilled = tempValue !== '' || humValue !== '';
        }

        return (
            <div className="grid grid-cols-12 gap-2 items-center mb-3">
                <div className="col-span-12 sm:col-span-4">
                    {isExtra && !readOnly ? (
                         <div className="flex items-center gap-2">
                            <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-red-500" onClick={() => removeExtraLog(index)}>
                                <Trash2 className="h-3 w-3" />
                            </Button>
                            <Input 
                                value={((data.extra_logs || []) as ExtraLog[])[index]?.label || ''} 
                                onChange={e => updateExtraLog(index, 'label', e.target.value)}
                                className="h-7 text-xs py-0"
                                placeholder="Label"
                            />
                         </div>
                    ) : (
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
                    )}
                </div>
                <div className="col-span-10 sm:col-span-6 grid grid-cols-2 gap-2">
                    <div className="relative">
                        <Input
                            type="number"
                            step="0.01"
                            placeholder="Temp"
                            value={tempValue}
                            onChange={(e) => {
                                if (isExtra) updateExtraLog(index, 'temp', e.target.value);
                                else setData(`${prefix}_temp` as keyof typeof data, e.target.value);
                            }}
                            readOnly={readOnly}
                            className={`pr-7 h-9 ${!isOk && tempValue !== '' ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                        />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <span className="text-gray-500 text-[10px]">°F</span>
                        </div>
                    </div>
                    <div className="relative">
                        <Input
                            type="number"
                            step="0.01"
                            placeholder="Hum"
                            value={humValue}
                            onChange={(e) => {
                                if (isExtra) updateExtraLog(index, 'humidity', e.target.value);
                                else setData(`${prefix}_humidity` as keyof typeof data, e.target.value);
                            }}
                            readOnly={readOnly}
                            className={`pr-7 h-9 ${!isOk && humValue !== '' ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                        />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <span className="text-gray-500 text-[10px]">%</span>
                        </div>
                    </div>
                </div>
                <div className="col-span-2 sm:col-span-2 flex justify-center">
                    {isFilled ? (
                        isOk ? 
                            <CheckCircle2 className="h-5 w-5 text-green-500" /> : 
                            <XCircle className="h-5 w-5 text-red-500" />
                    ) : (
                        <span className="text-xs text-gray-400 dark:text-gray-500">-</span>
                    )}
                </div>
            </div>
        );
    };

    const extraLogsToMap = (data.extra_logs || []) as ExtraLog[];

    return (
        <div className="mt-4 border-t border-gray-100 pt-4 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center justify-between">
                <span>Temperature & Humidity Log</span>
                <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full dark:bg-blue-900/40 dark:text-blue-300">
                    Limits: {TEMP_MIN}-{TEMP_MAX}°F / {HUM_MIN}-{HUM_MAX}%
                </span>
            </h3>
            
            <form onSubmit={submit} className="space-y-4">
                <InputRow label="Start of Shift" prefix="start" />
                <InputRow label="Mid-Route" prefix="mid" />
                <InputRow label="End of Shift" prefix="end" />

                {extraLogsToMap.map((_, idx) => (
                    <InputRow key={idx} label={extraLogsToMap[idx].label || `Extra #${idx+1}`} isExtra={true} index={idx} />
                ))}

                {!readOnly && (
                    <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        className="w-full border-dashed border-2 py-4 h-auto text-muted-foreground hover:text-foreground"
                        onClick={addExtraLog}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Extra Reading
                    </Button>
                )}

                {hasExcursion && (
                    <div className="rounded-md bg-orange-50 p-4 border border-orange-200 dark:bg-orange-900/30 dark:border-orange-800">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <AlertTriangle className="h-5 w-5 text-orange-400 dark:text-orange-500" aria-hidden="true" />
                            </div>
                            <div className="ml-3 flex-1">
                                <h3 className="text-sm font-medium text-orange-800 dark:text-orange-300">Out of Range Reading Detected</h3>
                                <div className="mt-2 text-sm text-orange-700">
                                    <Label htmlFor="corrective_action" className="text-orange-900 dark:text-orange-200">
                                        Corrective Action Taken <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="mt-1">
                                        <Textarea
                                            id="corrective_action"
                                            rows={2}
                                            required={hasExcursion}
                                            value={data.corrective_action as string}
                                            onChange={e => setData('corrective_action', e.target.value)}
                                            readOnly={readOnly}
                                            className="bg-white dark:bg-gray-800"
                                            placeholder="What steps were taken to resolve this?"
                                        />
                                        {errors.corrective_action && <p className="mt-1 text-sm text-red-600">{errors.corrective_action}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {!readOnly && (
                    <div className="pt-3 flex items-center justify-between gap-4">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="w-full sm:w-auto"
                        >
                            Save Log
                        </Button>
                        {envLog && (
                            <span className="text-[10px] text-gray-500 dark:text-gray-400 italic">
                                Last saved: {new Date(envLog.updated_at).toLocaleString()}
                            </span>
                        )}
                    </div>
                )}
            </form>
        </div>
    );
}

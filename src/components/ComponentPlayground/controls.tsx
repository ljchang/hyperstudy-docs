import React from 'react';
import styles from './styles.module.css';

export type ArgType =
  | { control: 'boolean'; defaultValue?: boolean; description?: string }
  | { control: 'text'; defaultValue?: string; description?: string; multiline?: boolean }
  | { control: 'number'; defaultValue?: number; description?: string; min?: number; max?: number; step?: number }
  | { control: 'color'; defaultValue?: string; description?: string }
  | { control: 'select'; options: string[]; defaultValue?: string; description?: string }
  | { control: 'object'; defaultValue?: unknown; description?: string };

export type ArgTypes = Record<string, ArgType>;

interface ControlRowProps {
  argKey: string;
  argType: ArgType;
  value: unknown;
  onChange: (next: unknown) => void;
}

function ControlRow({ argKey, argType, value, onChange }: ControlRowProps): JSX.Element {
  const label = argKey.split('.').pop() || argKey;

  let input: React.ReactNode;
  switch (argType.control) {
    case 'boolean':
      input = (
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={e => onChange(e.target.checked)}
        />
      );
      break;

    case 'number':
      input = (
        <input
          type="number"
          value={value == null ? '' : (value as number)}
          min={argType.min}
          max={argType.max}
          step={argType.step ?? 1}
          onChange={e => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
          className={styles.numberInput}
        />
      );
      break;

    case 'color':
      input = (
        <input
          type="color"
          value={(value as string) ?? '#000000'}
          onChange={e => onChange(e.target.value)}
          className={styles.colorInput}
        />
      );
      break;

    case 'select':
      input = (
        <select
          value={(value as string) ?? ''}
          onChange={e => onChange(e.target.value)}
          className={styles.select}
        >
          {argType.options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      );
      break;

    case 'text':
      input = argType.multiline ? (
        <textarea
          value={(value as string) ?? ''}
          onChange={e => onChange(e.target.value)}
          className={styles.textarea}
          rows={3}
        />
      ) : (
        <input
          type="text"
          value={(value as string) ?? ''}
          onChange={e => onChange(e.target.value)}
          className={styles.textInput}
        />
      );
      break;

    case 'object':
      input = (
        <textarea
          value={JSON.stringify(value ?? null, null, 2)}
          onChange={e => {
            try {
              onChange(JSON.parse(e.target.value));
            } catch {
              /* keep previous value while user is typing invalid JSON */
            }
          }}
          className={styles.textarea}
          rows={4}
        />
      );
      break;
  }

  return (
    <div className={styles.controlRow}>
      <label className={styles.controlLabel} title={argType.description}>
        {label}
      </label>
      {input}
    </div>
  );
}

interface ControlsPanelProps {
  argTypes: ArgTypes;
  values: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
}

export function ControlsPanel({ argTypes, values, onChange }: ControlsPanelProps): JSX.Element {
  return (
    <div className={styles.controls}>
      <div className={styles.controlsTitle}>Configuration</div>
      {Object.entries(argTypes).map(([key, argType]) => (
        <ControlRow
          key={key}
          argKey={key}
          argType={argType}
          value={values[key]}
          onChange={v => onChange(key, v)}
        />
      ))}
    </div>
  );
}

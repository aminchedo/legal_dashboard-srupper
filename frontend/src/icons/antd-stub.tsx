import React from 'react';

type IconProps = { className?: string; size?: number } & React.SVGProps<SVGSVGElement>;

function StubIcon({ className, size = 16 }: IconProps) {
  return (
    <span className={className} style={{ display: 'inline-block', width: size, height: size }} aria-hidden>
      ■
    </span>
  );
}

export const CaretRightOutlined = StubIcon;
export const ExperimentOutlined = StubIcon;
export const FileTextOutlined = StubIcon;
export const BarChartOutlined = StubIcon;
export const SettingOutlined = StubIcon;
export const ExclamationOutlined = StubIcon;
export const CloudServerOutlined = StubIcon;
export const DatabaseOutlined = StubIcon;
export const ThunderboltOutlined = StubIcon;
export const CloudOutlined = StubIcon;
export const HddOutlined = StubIcon;
export const UsbOutlined = StubIcon;
export const LinkOutlined = StubIcon;
export const CalendarOutlined = StubIcon;
export const TagOutlined = StubIcon;
export const StarOutlined = StubIcon;
export const DownloadOutlined = StubIcon;
export const FilterOutlined = StubIcon;
export const GlobalOutlined = StubIcon;
export const PlusOutlined = StubIcon;
export const ReloadOutlined = StubIcon;
export const SearchOutlined = StubIcon;
export const CloseOutlined = StubIcon;
export const DashboardOutlined = StubIcon;
export const EditOutlined = StubIcon;
export const FieldTimeOutlined = StubIcon;
export const WarningOutlined = StubIcon;
export const CloseCircleOutlined = StubIcon;
export const BellOutlined = StubIcon;
export const HomeOutlined = StubIcon;
export const MenuOutlined = StubIcon;
export const AlertOutlined = StubIcon;
export const SwapOutlined = StubIcon;
export const PlayCircleOutlined = StubIcon;
export const LoadingOutlined = StubIcon;
export const ClusterOutlined = StubIcon;
export const CheckCircleOutlined = StubIcon;
export const SafetyCertificateOutlined = StubIcon;
export const ClockCircleOutlined = StubIcon;
export const EnvironmentOutlined = StubIcon;
export const DeleteOutlined = StubIcon;
export const UploadOutlined = StubIcon;
export const UserOutlined = StubIcon;
export const LockOutlined = StubIcon;
export const MailOutlined = StubIcon;
export const EyeOutlined = StubIcon;
export const EyeInvisibleOutlined = StubIcon;
export const CheckCircleFilled = StubIcon;
export const LineChartOutlined = StubIcon;
export const PieChartOutlined = StubIcon;
export const FolderOpenOutlined = StubIcon;
export const AreaChartOutlined = StubIcon;
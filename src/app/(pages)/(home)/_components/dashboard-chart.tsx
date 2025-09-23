'use client';

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ChartContainer,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/_components/ui';
import { Repository } from '@/utils/types/registry.interface';
import { HardDrive, Wand2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Label, Pie, PieChart, Tooltip } from 'recharts';
import './dashboard-chart.scss';

interface DashboardChartProps {
  repositories: Repository[];
}

export default function DashboardChart({ repositories }: DashboardChartProps) {
  const [isCleanupDialogOpen, setIsCleanupDialogOpen] = useState(false);

  const cleanupCommands = [
    'docker run --rm \\',
    "  -v $(docker volume inspect --format '{{ .Mountpoint }}' qm-web-registry-m8aqqr_registry-data):/var/lib/registry \\",
    '  registry:2 garbage-collect /etc/docker/registry/config.yml',
  ];

  const chartData = useMemo(() => {
    return repositories
      .filter((repo) => repo.totalSize && repo.totalSize > 0)
      .map((repo, index) => ({
        name: repo.name,
        size: repo.totalSize || 0,
        fill: `var(--chart-${(index % 5) + 1})`,
      }));
  }, [repositories]);

  const chartConfig = useMemo(() => {
    const config: Record<string, { label: string; color?: string }> = {
      size: {
        label: 'Size',
      },
    };

    repositories.forEach((repo, index) => {
      config[repo.name] = {
        label: repo.name,
        color: `var(--chart-${(index % 5) + 1})`,
      };
    });

    return config;
  }, [repositories]);

  const totalSize = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.size, 0);
  }, [chartData]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Custom tooltip component
  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{ name: string; value: number; fill: string }>;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className='dashboard__tooltip'>
          <div className='dashboard__tooltip__content'>
            <div className='dashboard__tooltip__title'>{data.name}</div>
            <div className='dashboard__tooltip__value'>
              {formatFileSize(data.value || 0)}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <div className='dashboard'>
        <div className='dashboard__empty'>
          <h2>No images found</h2>
          <p>No Docker images with size data available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='dashboard'>
      <Card className='dashboard__card'>
        <CardHeader className='dashboard__card__header'>
          <div className='dashboard__card__header__content'>
            <CardTitle>
              <HardDrive />
              Storage
            </CardTitle>
            <Dialog
              open={isCleanupDialogOpen}
              onOpenChange={setIsCleanupDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant='primary' size='sm'>
                  <Wand2 size={16} />
                  Clean up
                </Button>
              </DialogTrigger>
              <DialogContent className='dashboard__cleanup-dialog'>
                <DialogHeader>
                  <DialogTitle>Registry Cleanup Commands</DialogTitle>
                  <DialogDescription>
                    Run these commands to perform garbage collection on your
                    Docker registry. This will remove unused layers and free up
                    disk space. Make sure the registry container is stopped
                    before running these commands.
                  </DialogDescription>
                </DialogHeader>
                <div className='dashboard__cleanup-commands'>
                  <pre className='dashboard__cleanup-commands__code'>
                    {cleanupCommands.join('\n')}
                  </pre>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className='dashboard__card__content'>
          <ChartContainer
            config={chartConfig}
            className='dashboard__chart'
            style={{
              width: '400px',
              height: '400px',
              margin: '0 auto',
            }}
            tabIndex={-1}
          >
            <PieChart width={400} height={400}>
              <Tooltip content={<CustomTooltip />} cursor={false} />
              <Pie
                data={chartData}
                dataKey='size'
                nameKey='name'
                innerRadius={60}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor='middle'
                          dominantBaseline='middle'
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className='dashboard__chart__total'
                          >
                            {formatFileSize(totalSize)}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className='dashboard__chart__label'
                          >
                            Total Size
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

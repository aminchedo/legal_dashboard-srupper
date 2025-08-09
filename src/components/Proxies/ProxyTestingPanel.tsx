import React, { useState } from 'react';
import { Card, Input, Button, message, Divider, Switch, List } from 'antd';
import { Bot, Search, CheckCircle2, XCircle } from 'lucide-react';

const ProxyTestingPanel: React.FC = () => {
    const [testUrl, setTestUrl] = useState('https://httpbin.org/ip');
    const [proxyToTest, setProxyToTest] = useState('');
    const [testing, setTesting] = useState(false);
    const [testResult, setTestResult] = useState<any>(null);

    // New state for intelligent features
    const [intelligentMode, setIntelligentMode] = useState(true);
    const [autoDiscoverEnabled, setAutoDiscoverEnabled] = useState(true);
    const [freeProxies, setFreeProxies] = useState<string[]>([]);
    const [discovering, setDiscovering] = useState(false);

    const testProxy = async () => {
        setTesting(true);
        setTestResult(null);
        try {
            const response = await fetch('/api/proxy/test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ proxy: proxyToTest, testUrl }),
            });
            const result = await response.json();
            setTestResult(result);
            if (result.success) {
                message.success(`Proxy is working! Status: ${result.statusCode}, Latency: ${result.latencyMs}ms`);
            } else {
                message.error(`Proxy test failed: ${result.errorMessage}`);
            }
        } catch (error) {
            message.error('Failed to test proxy.');
            setTestResult({ success: false, errorMessage: 'Request failed' });
        }
        setTesting(false);
    };

    // ADD intelligent test function
    const testIntelligentConnection = async (url = 'https://httpbin.org/ip') => {
        setTesting(true);
        setTestResult(null);
        try {
            const response = await fetch('/api/proxy/test-intelligent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });

            const result = await response.json();
            setTestResult(result);

            if (result.success) {
                message.success(`✅ ${result.method.toUpperCase()} connection successful: ${result.message}`);
            } else {
                message.error(`❌ Connection failed: ${result.message || result.error}`);
            }

        } catch (error) {
            message.error('Intelligent test failed');
        }
        setTesting(false);
    };

    const discoverFreeProxies = async () => {
        setDiscovering(true);
        try {
            const response = await fetch('/api/proxy/discover-free', {
                method: 'POST'
            });

            const result = await response.json();

            if (result.success) {
                setFreeProxies(result.proxies);
                message.success(`🔍 Discovered ${result.count} free proxies`);
            } else {
                message.error(`Failed to discover free proxies: ${result.error}`);
            }

        } catch (error) {
            message.error('Failed to discover free proxies');
        }
        setDiscovering(false);
    };

    return (
        <Card title="Proxy Tester">
            <Input.Group compact>
                <Input
                    style={{ width: 'calc(100% - 200px)' }}
                    placeholder="Enter proxy to test (e.g. http://user:pass@host:port)"
                    value={proxyToTest}
                    onChange={(e) => setProxyToTest(e.target.value)}
                />
                <Button type="default" onClick={testProxy} loading={testing}>
                    Test Manual Proxy
                </Button>
            </Input.Group>

            {testResult && (
                <div style={{ marginTop: '1rem' }}>
                    {testResult.success ? (
                        <CheckCircleOutlined style={{ color: 'green' }} />
                    ) : (
                        <CloseCircleOutlined style={{ color: 'red' }} />
                    )}
                    <span style={{ marginLeft: '8px' }}>
                        {testResult.success ? `Success (Status: ${testResult.statusCode}, Latency: ${testResult.latencyMs}ms)` : `Failed: ${testResult.errorMessage}`}
                    </span>
                </div>
            )}

            <Divider>🧠 Intelligent Features</Divider>

            <div className="intelligent-controls">
                <div style={{ marginBottom: '1rem' }}>
                    <span style={{ marginRight: '1rem' }}>🧠 Smart Proxy Mode:</span>
                    <Switch
                        checked={intelligentMode}
                        onChange={setIntelligentMode}
                        checkedChildren="ON"
                        unCheckedChildren="OFF"
                    />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <span style={{ marginRight: '1rem' }}>🔍 Auto-Discover Free Proxies:</span>
                    <Switch
                        checked={autoDiscoverEnabled}
                        onChange={setAutoDiscoverEnabled}
                        disabled={!intelligentMode}
                    />
                </div>

                <div className="action-buttons">
                    <Button
                        type="primary"
                        icon={<RobotOutlined />}
                        onClick={() => testIntelligentConnection()}
                        loading={testing}
                    >
                        Test Intelligent System
                    </Button>

                    <Button
                        icon={<SearchOutlined />}
                        onClick={discoverFreeProxies}
                        disabled={!autoDiscoverEnabled}
                        loading={discovering}
                        style={{ marginLeft: 8 }}
                    >
                        Discover Free Proxies
                    </Button>
                </div>

                {freeProxies.length > 0 && (
                    <div className="free-proxies-list" style={{ marginTop: '1rem' }}>
                        <h4>🆓 Discovered Free Proxies ({freeProxies.length})</h4>
                        <List
                            size="small"
                            bordered
                            dataSource={freeProxies.slice(0, 5)}
                            renderItem={(item) => <List.Item>{item}</List.Item>}
                        />
                    </div>
                )}
            </div>
        </Card>
    );
};

export default ProxyTestingPanel;


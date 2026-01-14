/**
 * 测试 Cloudflare Worker
 *
 * 使用方法:
 * 1. 部署 Worker 后，修改 WORKER_URL
 * 2. 运行: node test.js
 */

// 修改为你的 Worker URL
const WORKER_URL = 'https://xiaomimimo-proxy.your-subdomain.workers.dev';

// 修改为你的小米 Mimo API Key
const API_KEY = 'YOUR_XIAOMIMIMO_API_KEY';

// 测试配置
const TEST_CASES = [
  {
    name: '基本测试 - 简单对话',
    body: {
      model: 'mimo-v2-flash',
      messages: [
        { role: 'user', content: '你好，请介绍一下你自己' }
      ],
      max_tokens: 100
    }
  },
  {
    name: '流式响应测试',
    body: {
      model: 'mimo-v2-flash',
      messages: [
        { role: 'user', content: '用中文写一个简单的 Hello World 程序' }
      ],
      stream: true,
      max_tokens: 200
    }
  },
  {
    name: '错误测试 - 缺少 API Key',
    body: {
      model: 'mimo-v2-flash',
      messages: [{ role: 'user', content: '测试' }]
    },
    useWrongKey: true
  }
];

async function runTest(testCase) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`测试: ${testCase.name}`);
  console.log('='.repeat(60));

  try {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': testCase.useWrongKey ? 'Bearer wrong-key' : `Bearer ${API_KEY}`
    };

    console.log('请求体:', JSON.stringify(testCase.body, null, 2));
    console.log('发送请求...\n');

    const startTime = Date.now();

    const response = await fetch(WORKER_URL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(testCase.body)
    });

    const duration = Date.now() - startTime;

    console.log(`响应状态: ${response.status} ${response.statusText}`);
    console.log(`响应时间: ${duration}ms`);

    const headersList = {};
    response.headers.forEach((value, key) => {
      if (key.toLowerCase().includes('access-control') || key.toLowerCase().includes('x-')) {
        headersList[key] = value;
      }
    });
    console.log('响应头:', headersList);

    const data = await response.json();

    if (response.ok) {
      console.log('\n✅ 成功!');
      console.log('响应数据:', JSON.stringify(data, null, 2));

      if (data.choices && data.choices[0]) {
        console.log('\n回复内容:', data.choices[0].message?.content || data.choices[0].text);
      }
    } else {
      console.log('\n❌ 错误响应:');
      console.log(JSON.stringify(data, null, 2));
    }

    return response.ok;

  } catch (error) {
    console.log('\n❌ 请求失败:');
    console.log('错误信息:', error.message);
    return false;
  }
}

async function main() {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║          Cloudflare Worker 测试工具                          ║
║          小米 Mimo API 代理                                  ║
╚══════════════════════════════════════════════════════════════╝
  `);

  console.log(`Worker URL: ${WORKER_URL}`);
  console.log(`API Key: ${API_KEY.substring(0, 10)}...`);
  console.log(`\n开始测试 (${TEST_CASES.length} 个测试用例)...\n`);

  let passed = 0;
  let failed = 0;

  for (const testCase of TEST_CASES) {
    const result = await runTest(testCase);
    if (result) {
      passed++;
    } else {
      failed++;
    }

    // 等待 1 秒，避免请求过快
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log('测试总结');
  console.log('='.repeat(60));
  console.log(`总测试: ${TEST_CASES.length}`);
  console.log(`✅ 通过: ${passed}`);
  console.log(`❌ 失败: ${failed}`);
  console.log('='.repeat(60));

  if (failed === 0) {
    console.log('\n🎉 所有测试通过！Worker 工作正常。');
    console.log('现在可以在 Mark2Web 中使用这个 Worker 了。');
  } else {
    console.log('\n⚠️ 有测试失败，请检查:');
    console.log('1. Worker URL 是否正确');
    console.log('2. API Key 是否有效');
    console.log('3. Worker 是否已部署');
    console.log('4. 网络连接是否正常');
  }
}

// 检查配置
if (WORKER_URL.includes('your-subdomain') || API_KEY.includes('YOUR_XIAOMIMIMO')) {
  console.log('\n❌ 请先修改 test.js 中的配置！');
  console.log('   - WORKER_URL: 改为你的 Worker URL');
  console.log('   - API_KEY: 改为你的小米 Mimo API Key');
  console.log('\n配置完成后重新运行: node test.js\n');
  process.exit(1);
}

main().catch(console.error);

'use strict';

const OtelApi = require('@opentelemetry/api');

const getMetricNames = (metricNames, useUniqueHistogramName, metricsPrefix, projectName) => {
    const prefix = useUniqueHistogramName === true ? projectName : metricsPrefix;

    if (prefix) {
        Object.keys(metricNames).forEach(key => {
            metricNames[key] = `${prefix}_${metricNames[key]}`;
        });
    }

    return metricNames;
};

const isArray = (input) => Array.isArray(input);

const isFunction = (input) => typeof input === 'function';

const isString = (input) => typeof input === 'string';

const shouldLogMetrics = (excludeRoutes, route) => excludeRoutes.every((path) => !route.includes(path));

const validateInput = ({ input, isValidInputFn, defaultValue, errorMessage }) => {
    if (typeof input !== 'undefined') {
        if (isValidInputFn(input)) {
            return input;
        } else {
            throw new Error(errorMessage);
        }
    }

    return defaultValue;
};

const getTraceContextIds = () => {
    let contextIds = {};
    let current_span = OtelApi.trace.getSpan(OtelApi.context.active());
    if(current_span) {
        contextIds = {
            'traceId': current_span.spanContext().traceId,
            'spanId': current_span.spanContext().spanId
        };
    }
    return contextIds;
};

module.exports.getMetricNames = getMetricNames;
module.exports.isArray = isArray;
module.exports.isFunction = isFunction;
module.exports.isString = isString;
module.exports.shouldLogMetrics = shouldLogMetrics;
module.exports.validateInput = validateInput;
module.exports.getTraceContextIds = getTraceContextIds;

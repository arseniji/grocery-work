const fillEndpointTemplate = (
  endpointTemplate: string,
  payload: Record<string, unknown> = {}
): string =>
  endpointTemplate.replace(/{([a-zA-Z]+)}/g, (_, key) => {
    const replaceValue = payload[key];

    if (replaceValue === undefined) {
      throw new Error(`Can't find key for API template ${key} in payload`);
    }

    return String(replaceValue);
  });

export { fillEndpointTemplate };

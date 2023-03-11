import useLocalStorage from "./useLocalStorage";

const useQueryCommand = (input, commands) => {
    const args = input.split(' ');
    const command = commands.find(cmd => cmd.name === args[0]);
    
    if (!command) {
      return { type: 'invalid' };
    }
  
    if (command.name === '=note') {
      const note = args.slice(1).join(' ');
      return { type: 'note', payload: note };
    }
  
    if (command.name === '=clear') {
      return { type: 'clear' };
    }
  
    if (command.name === '=add') {
      if (args[1] === '-s') {
        return { type: 'addShortcut', payload: { shortcut: args[2], url: args.slice(3).join(' ') } };
      } else if (args[1] === '/l') {
        return { type: 'addLink', payload: { name: args[2], url: args.slice(3).join(' ') } };
      }
    }
  
    if (command.name === '=remove') {
      if (args[1].startsWith('-')) {
        return { type: 'removeShortcut', payload: args[1].slice(1) };
      } else if (args[1].startsWith('/')) {
        return { type: 'removeLink', payload: args[1].slice(1) };
      }
    }
  
    if (command.name === '=edit') {
      if (args[1] === '-s') {
        return { type: 'editShortcut', payload: { shortcut: args[2], url: args.slice(3).join(' ') } };
      } else if (args[1] === '/l') {
        return { type: 'editLink', payload: { name: args[2], url: args.slice(3).join(' ') } };
      }
    }
  
    return { type: 'invalid' };
  };
  
  export default useQueryCommand;
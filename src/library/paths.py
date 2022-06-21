import os

def CreatePaths():
  paths= { 'PRJ_DIR': '', 'SRC_DIR': 'src', 'SCRPTS_DIR': 'scripts', 'IMGS_DIR': 'imgs', 'DATA_DIR': 'data', 'CONF_DIR': 'config' }
  if paths['PRJ_DIR'] == '':
    curDir = os.getcwd().replace('\\', '/')
    for path in paths:
      if path == 'PRJ_DIR':
          continue
      index = curDir.find(paths[path])
      if index != -1:
        paths['PRJ_DIR'] = curDir[:index-1]
        break

  for key, value in paths.items():
    if key != 'PRJ_DIR':
      paths[key] = paths['PRJ_DIR'] + '/' + value

  return paths



def GetPath(path):
    paths = CreatePaths()

    for key, value in paths.items():
        path = path.replace(f'%{key}%', value)
    path = path.replace('//', '/')
    return path